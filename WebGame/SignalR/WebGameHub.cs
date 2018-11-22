using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using WebGame.Class;

namespace WebGame.SignalR
{
    public class WebGameHub : Hub
    {
        //public void Hello()
        //{
        //    Clients.All.hello();
        //}
        Random random = new Random() ;
        public static Dictionary<string, string> CodeList = new Dictionary<string, string>();
        public static List<Player> PlayerList = new List<Player>();

        public void GetId()
        {
            string PlayerId = Context.ConnectionId;
            PlayerList.Add(new Player {ConnectionId = PlayerId });
            Clients.Client(Context.ConnectionId).getConnectionId(PlayerId);
           
        }
        public void ConnectToHub(string playerName)
        {
            PlayerList.Add(new Player
            {
                ConnectionId = Context.ConnectionId,
                PlayerName = playerName
            });
        }
    }
}