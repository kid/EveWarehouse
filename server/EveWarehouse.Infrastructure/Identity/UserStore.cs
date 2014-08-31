using Microsoft.AspNet.Identity;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Globalization;
using System.Threading.Tasks;

namespace EveWarehouse.Infrastructure.Identity
{
    public class UserStore<TUser> :
        IUserStore<TUser>,
        IUserPasswordStore<TUser>
        where TUser : IdentityUser
    {
        private readonly Func<string, string> _partitionKeyFromId;
        private readonly CloudTable _userTableReference;

        public UserStore(CloudStorageAccount storageAccount)
        {
            _partitionKeyFromId = id => id.GetHashCode().ToString(CultureInfo.InvariantCulture);

            var tableClient = storageAccount.CreateCloudTableClient();
            _userTableReference = tableClient.GetTableReference("Users");
            _userTableReference.CreateIfNotExists();
        }

        public void Dispose()
        {
        }

        public async Task CreateAsync(TUser user)
        {
            user.PartitionKey = _partitionKeyFromId(user.Id);
            await GetUserTable().ExecuteAsync(TableOperation.Insert(user));
        }

        public async Task UpdateAsync(TUser user)
        {
            user.PartitionKey = _partitionKeyFromId(user.Id);
            await GetUserTable().ExecuteAsync(TableOperation.Replace(user));
        }

        public async Task DeleteAsync(TUser user)
        {
            user.ETag = "*";
            await GetUserTable().ExecuteAsync(TableOperation.Delete(user));
        }

        public async Task<TUser> FindByIdAsync(string userId)
        {
            var partitionKey = _partitionKeyFromId(userId);
            var operation = TableOperation.Retrieve<TUser>(partitionKey, userId);
            var result = await GetUserTable().ExecuteAsync(operation);
            return (TUser)result.Result;
        }

        public Task<TUser> FindByNameAsync(string userName)
        {
            return FindByIdAsync(userName);
        }

        public Task<string> GetPasswordHashAsync(TUser user)
        {
            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(TUser user)
        {
            return Task.FromResult(string.IsNullOrEmpty(user.PasswordHash));
        }

        public Task SetPasswordHashAsync(TUser user, string passwordHash)
        {
            user.PasswordHash = passwordHash;
            return TaskConstants.Completed;
        }

        private CloudTable GetUserTable()
        {
            return _userTableReference;
        }
    }
}
