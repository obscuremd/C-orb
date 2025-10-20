using StackExchange.Redis;

public class RedisService
{
    private IDatabase _cache;

    private RedisService() { }

    public static async Task<RedisService> CreateAsync()
    {
        var options = new ConfigurationOptions
        {
            EndPoints = { "redis-15807.c90.us-east-1-3.ec2.redns.redis-cloud.com:15807" },
            User = "default",
            Password = "KhgDN4YU2ONTXNJU7L6tla7FTqfmmueI",
            Ssl = true,
            SslHost = "redis-15807.c90.us-east-1-3.ec2.redns.redis-cloud.com", // 👈 important
            AbortOnConnectFail = false,
            ConnectTimeout = 10000,
        };


        var redis = await ConnectionMultiplexer.ConnectAsync(options);
        var service = new RedisService();
        service._cache = redis.GetDatabase();
        return service;
    }

    public async Task SetAsync(string key, string value, TimeSpan? expiry = null)
    {
        await _cache.StringSetAsync(key, value, expiry);
    }

    public async Task<string?> GetAsync(string key)
    {
        return await _cache.StringGetAsync(key);
    }
}
