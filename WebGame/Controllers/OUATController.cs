using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGame.Models;
using WebGame.SignalR;
using WebLib.Utils;

namespace WebGame.Controllers
{
    public class OUATController : Controller
    {
        List<GameCard> testList = new List<GameCard>()
        {
            new GameCard{Id=1,No="t01", Text="t01T"},
            new GameCard{Id=2,No="t02", Text="t02T"},
            new GameCard{Id=3,No="t03", Text="t03T"},
        };
        public ActionResult Index(Player model)
        {
            model.ControllerName = ControllerContext.RouteData.Values["controller"].ToString();            
            return View(model);
        }
        [HttpPost]
        public JsonResult PlayerListOfRoom(string roomName)
        {
            List<Player> players = new List<Player>();
            var query = OUATHub.roomList.Find(x => string.Equals(x.Name, roomName));
            if (query != null)
            {
                players = query.PlayerList;
            }
            return new JsonResult { Data = new { data = JavaScriptObjectParser.Parse(players) } };
        }
        public void EnterRoom(Player player)
        {

        }
    }
}