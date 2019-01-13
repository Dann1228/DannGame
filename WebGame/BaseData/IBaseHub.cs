using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using WebGame.Models;

namespace WebGame.BaseData
{
    public interface IBaseHub
    {
        void ConnectToHub(string playerName);
        JsonResult CreateRoom(PlayerRoom room);
        JsonResult CurrentRoomList();
    }
}
