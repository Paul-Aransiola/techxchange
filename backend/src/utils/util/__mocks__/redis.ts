const mockRedisData: Record<string, { value: string; expiration?: number }> = {};


export const setValueInRedis = async (key: string, value: string, expiration?: number): Promise<void> => {
    if (!key.trim()) {
        throw new Error('The key cannot be an empty string');
    }
    if (!value.trim()) {
        throw new Error('The value cannot be an empty string');
    }

    mockRedisData[key] = { value, expiration };
};

export const getValueFromRedis = async (key: string): Promise<string | null> => {
    if (!mockRedisData[key]) {
        return null;
    }
    return mockRedisData[key].value;
};

export const deleteValueFromRedis = async (key: string): Promise<boolean> => {
    if (mockRedisData[key]) {
        delete mockRedisData[key];
        return true;
    }
    return false;
};

export const clearMockRedis = async (): Promise<void> => {
    Object.keys(mockRedisData).forEach((key) => delete mockRedisData[key]);
};

export default {
    setValueInRedis,
    getValueFromRedis,
    deleteValueFromRedis,
    clearMockRedis,
};
