using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace Digbyswift.Umbraco.v16.Demo.Dashboard.Controllers
{
    [ApiController]
    [BackOfficeRoute("digbyswiftumbracov16demodashboard/api/v{version:apiVersion}")]
    [Authorize(Policy = AuthorizationPolicies.SectionAccessContent)]
    [MapToApi(Constants.ApiName)]
    public class DigbyswiftUmbracov16DemoDashboardApiControllerBase : ControllerBase
    {
    }
}
