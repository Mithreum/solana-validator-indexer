import { Connection, StakeProgram } from "@solana/web3.js";
import { connection } from "../config";
import { Validator, Stake, Reward } from "../models";

// Constants for lamport conversions
const LAMPORTS_PER_SIGNATURE = 5000;
const LAMPORTS_PER_SOL = 1_000_000_000;

/**
 * Fetches the on‑chain epoch schedule.
 */
export async function getEpochSchedule() {
  return await connection.getEpochSchedule();
}

/**
 * Fetches the current set of vote accounts (validators).
 */
export async function getVoteAccounts() {
  const { current, delinquent } = await connection.getVoteAccounts();
  return { current, delinquent };
}

/**
 * Sums all lamports delegated to a given validator vote account.
 *
 * @param votePubkey - The validator's vote account public key.
 */
export async function getDelegatedStake(votePubkey: string): Promise<number> {
  const parsedAccounts = await connection.getParsedProgramAccounts(
    StakeProgram.programId,
    {
      filters: [
        {
          memcmp: {
            offset: 124,
            bytes: votePubkey,
          },
        },
      ],
    }
  );

  return parsedAccounts.reduce((sum, acct) => {
    const stakeInfo = (acct.account.data as any).parsed.info.stake.delegation;
    return sum + Number(stakeInfo.stake);
  }, 0);
}

/**
 * Inserts a snapshot of stakes and rewards for all validators at a given epoch.
 *
 * @param epoch - The epoch to index.
 */
export async function insertStakeAndReward(epoch: number): Promise<void> {
  // Fetch vote accounts and schedule
  const { current } = await getVoteAccounts();
  const sched = await getEpochSchedule();
  const { firstNormalEpoch, firstNormalSlot, slotsPerEpoch } = sched;

  // Compute the first slot of the epoch
  const firstSlot =
    epoch < firstNormalEpoch
      ? epoch * slotsPerEpoch
      : firstNormalSlot + (epoch - firstNormalEpoch) * slotsPerEpoch;

  // Get a timestamp for the epoch
  const blockTime = await connection.getBlockTime(firstSlot);
  const timestamp = blockTime ? new Date(blockTime * 1000) : new Date();

  for (const v of current) {
    const activated = Number(v.activatedStake);
    const delegated = await getDelegatedStake(v.votePubkey);
    const total = activated + delegated;
    const selfStakePct = total > 0 ? activated / total : 0;

    // Upsert Validator metadata
    await Validator.updateOne(
      { votePubkey: v.votePubkey },
      {
        $setOnInsert: {
          votePubkey: v.votePubkey,
          nodePubkey: v.nodePubkey,
          commission: v.commission,
          firstSeenEpoch: epoch,
        },
        $set: { lastSeenEpoch: epoch },
      },
      { upsert: true }
    );

    // Write stake snapshot
    await Stake.create({
      votePubkey: v.votePubkey,
      epoch,
      activatedStake: activated,
      delegatedStake: delegated,
      totalStake: total,
      selfStakePct,
      timestamp,
    });

    // Compute reward for this epoch
    const creditsArr = v.epochCredits ?? [];
    const entry =
      creditsArr.find((c) => c[0] === epoch) || creditsArr[creditsArr.length - 1] || [epoch, 0, 0];
    const rewardCredits = entry[1] - entry[2];
    const rewardLamports = rewardCredits * LAMPORTS_PER_SIGNATURE;
    const rewardSOL = rewardLamports / LAMPORTS_PER_SOL;

    // Write reward record
    await Reward.create({
      votePubkey: v.votePubkey,
      epoch,
      credits: entry[1],
      prevCredits: entry[2],
      rewardLamports,
      rewardSOL,
      timestamp,
    });
  }
}