using Microsoft.AspNet.Identity;

namespace EveWarehouse.Infrastructure.Identity
{
    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> userStore)
            : base(userStore)
        {
        }
    }
}
