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

        public ActionResult Index(Player model)
        {
            return View(model);
        }

    }
}