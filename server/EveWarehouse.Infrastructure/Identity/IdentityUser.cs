using Microsoft.AspNet.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace EveWarehouse.Infrastructure.Identity
{
    public class IdentityUser : TableEntity, IUser
    {
        public string Id
        {
            // Keeping it simple and mapping IUser.Id to IUser.UserName. 
            // This allows easy, efficient lookup by setting this to be the rowkey in table storage
            get { return UserName; }
        }

        public string UserName
        {
            get { return RowKey; }
            set { RowKey = value; }
        }

        public string PasswordHash { get; set; }
    }
}
