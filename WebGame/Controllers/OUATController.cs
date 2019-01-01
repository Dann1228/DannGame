using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGame.Models;
using WebGame.SignalR;

namespace WebGame.Controllers
{
    public class OUATController : Controller
    {
        // GET: OUAT
        List<GameCard> testList = new List<GameCard>()
        {
            new GameCard{Id=1,No="t01", Text="t01T"},
            new GameCard{Id=2,No="t02", Text="t02T"},
            new GameCard{Id=3,No="t03", Text="t03T"},
        };
        public ActionResult Index(Player model)
        {
            return View(model);
        }

    }
}