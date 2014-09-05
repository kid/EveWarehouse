using Autofac;
using Autofac.Builder;
using Autofac.Core.Lifetime;
using Autofac.Integration.WebApi;
using EveWarehouse.Infrastructure.EveLib;
using EveWarehouse.Infrastructure.Identity;
using EveWarehouse.Infrastructure.Identity.Providers;
using eZet.EveLib.Core.Cache;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Microsoft.WindowsAzure.Storage;
using Owin;
using StackExchange.Redis;
using System;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;

[assembly: OwinStartup(typeof(EveWarehouse.Api.Startup))]

namespace EveWarehouse.Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var container = CreateContainer();

            // Needs to be called as early as possible.
            app.UseAutofacMiddleware(container);

            var config = new HttpConfiguration
                {
                    DependencyResolver = new AutofacWebApiDependencyResolver(container)
                };

            ConfigureOAuth(app, container);
            WebApiConfig.Register(config);

            app.UseCors(CorsOptions.AllowAll);
            app.UseWebApi(config);
            app.UseAutofacWebApi(config);
        }

        public IContainer CreateContainer()
        {
            var builder = new ContainerBuilder();

            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.ConnectionStrings["StorageConnectionString"].ConnectionString);
            builder.RegisterInstance(storageAccount).SingleInstance();

            builder.Register(context => context.Resolve<CloudStorageAccount>().CreateCloudFileClient()).AsSelf().InstancePerRequest();
            builder.Register(context => context.Resolve<CloudStorageAccount>().CreateCloudQueueClient()).AsSelf().InstancePerRequest();
            builder.Register(context => context.Resolve<CloudStorageAccount>().CreateCloudTableClient()).AsSelf().InstancePerRequest();

            builder.Register(_ =>
                {
                    var connectionString = ConfigurationManager.ConnectionStrings["RedisCache"].ConnectionString;
                    return ConnectionMultiplexer.Connect(connectionString);
                })
                .SingleInstance();

            builder.RegisterType<AzureRedisCache>().As<IEveLibCache>().SingleInstance();

            builder.RegisterType<ApplicationUserManager>().InstancePerRequest();

            builder
                .RegisterType<UserStore<ApplicationUser>>()
                .AsImplementedInterfaces<IUserStore<ApplicationUser>, ConcreteReflectionActivatorData>()
                .InstancePerRequest();

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
                    Provider = new SimpleAuthorizationServerProvider(GetUserManager)
                };

            app.UseOAuthAuthorizationServer(options);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
        }

        private static ApplicationUserManager GetUserManager()
        {
            var context = HttpContext.Current.Request.GetOwinContext();
            var scope = context.Environment.FirstOrDefault(f => f.Key == "autofac:OwinLifetimeScope").Value as LifetimeScope;
            if (scope == null)
            {
                throw new Exception("RequestScope cannot be null.");
            }

            return scope.GetService(typeof(ApplicationUserManager)) as ApplicationUserManager;
        }
    }
}