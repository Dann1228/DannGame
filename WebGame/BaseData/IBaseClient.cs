using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using WebGame.Models;

namespace WebGame.BaseData
{
    public interface IBaseClient
    {
        /// <summary>
        /// 重複ConnectionId或名稱
        /// </summary>
        /// <returns></returns>
       Task duplicateConnectionId();
        void getOnlinePlayerNumber(int number);
       // void getOnlinePlayerNumberSelf(int number);
        Task CurrentRoomList(JsonResult response);
    }
}
