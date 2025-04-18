/**
 * Metadata model for tracking the last indexed epoch.
 */
export interface IMetadata extends Document {
    lastIndexedEpoch: number;
}

/**
 * Reward record model
 */
export interface IReward extends Document {
    votePubkey: string;
    epoch: number;
    rewardLamports: number;
    rewardSOL: number;
    credits: number;
    prevCredits: number;
    timestamp: Date;
}

/**
 * Stake snapshot model
 */
export interface IStake extends Document {
    votePubkey: string;
    epoch: number;
    activatedStake: number;
    delegatedStake: number;
    totalStake: number;
    selfStakePct: number;
    timestamp: Date;
}

/**
 * Validator model
 */
export interface IValidator extends Document {
    votePubkey: string;
    nodePubkey: string;
    commission: number;
    firstSeenEpoch: number;
    lastSeenEpoch: number;
    metadata?: {
        address: string;
        name?: string;
        website?: string;
    };
}

