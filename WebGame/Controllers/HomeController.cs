using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGame.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.Ajax.Utilities;
using WebGame.SignalR;

namespace WebGame.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";
            
            return View();
        }

        [HttpPost]
        public ActionResult GameLobby(Player model)
        {            
            return View(model);           
        }
    }
}