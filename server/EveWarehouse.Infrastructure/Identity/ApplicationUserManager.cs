using Microsoft.AspNet.Identity;

namespace EveWarehouse.Infrastructure.Identity
{
    public class ApplicationUserManager : UserManager<User>
    {
        public ApplicationUserManager(IUserStore<User> userStore)
            : base(userStore)
        {
        }
    }
}
