using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebGame.Models
{
    public class Player
    {
        /// <summary>
        /// 主要連線
        /// </summary>
        public string ConnectionId { get; set; }

        /// <summary>
        /// 玩家名稱
        /// </summary>
        public string PlayerName { get; set; }

        //public string IPAddress { get; set; }
    }
}