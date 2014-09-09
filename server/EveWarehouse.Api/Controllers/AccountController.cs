using EveWarehouse.Api.Models;
using EveWarehouse.Infrastructure.Identity;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;
using System.Web.Http;

namespace EveWarehouse.Api.Controllers
{
    [RoutePrefix("api/accounts")]
    public class AccountController : ApiController
    {
        private ApplicationUserManager _userManager;

        public AccountController(ApplicationUserManager userManager)
        {
            _userManager = userManager;
        }


        [AllowAnonymous]
        [Route("register")]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var identityUser = new User
                {
                    UserName = userModel.UserName
                };

            var result = await _userManager.CreateAsync(identityUser, userModel.Password);
            var errorResult = GetErrorResult(result);
            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _userManager.Dispose();
            }

            base.Dispose(disposing);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}
