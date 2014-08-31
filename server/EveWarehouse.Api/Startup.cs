using Autofac;
using Autofac.Builder;
using Autofac.Integration.WebApi;
using EveWarehouse.Infrastructure.Identity;
using EveWarehouse.Infrastructure.Identity.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Storage;
using Owin;
using System;
using System.Web.Http;

[assembly: OwinStartup(typeof(EveWarehouse.Api.Startup))]

namespace EveWarehouse.Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var container = CreateContainer();

            var config = new HttpConfiguration
                {
                    DependencyResolver = new AutofacWebApiDependencyResolver(container)
                };

            app.UseAutofacMiddleware(container);

            ConfigureOAuth(app, container);
            WebApiConfig.Register(config);

            app.UseCors(CorsOptions.AllowAll);
            app.UseWebApi(config);
            app.UseAutofacWebApi(config);
        }

        public IContainer CreateContainer()
        {
            var builder = new ContainerBuilder();

            builder
                .Register(_ => CloudStorageAccount.Parse(CloudConfigurationManager.GetSetting("StorageConnectionString")))
                .AsSelf();

            builder
                .RegisterType<UserStore<ApplicationUser>>()
                .AsImplementedInterfaces<IUserStore<ApplicationUser>, ConcreteReflectionActivatorData>();

            builder
                .RegisterType<ApplicationUserManager>()
                .AsSelf();

            builder.RegisterType<SimpleAuthorizationServerProvider>()
                .AsImplementedInterfaces<IOAuthAuthorizationServerProvider, ConcreteReflectionActivatorData>().SingleInstance();

            //builder.RegisterType<SimpleRefreshTokenProvider>()
            //    .AsImplementedInterfaces<IAuthenticationTokenProvider, ConcreteReflectionActivatorData>().SingleInstance();

            builder.RegisterApiControllers(typeof(Startup).Assembly);

            return builder.Build();
        }

        public void ConfigureOAuth(IAppBuilder app, IContainer container)
        {
            var options = new OAuthAuthorizationServerOptions
                {
                    AllowInsecureHttp = true,
                    TokenEndpointPath = new PathString("/api/token"),
                    AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(30),
                    Provider = container.Resolve<IOAuthAuthorizationServerProvider>(),
                    //RefreshTokenProvider = container.Resolve<IAuthenticationTokenProvider>()
                };

            app.UseOAuthAuthorizationServer(options);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }
    }
}