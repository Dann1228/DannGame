using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using WebGame.Class;

namespace WebGame.SignalR
{
    public class WebGameHub : Hub
    {
        public static List<Player> PlayerList = new List<Player>();

        public void GetPlayerNumber()
        {          
            Clients.Client(Context.ConnectionId).getPlayerNumber(PlayerList.Count());           
        }
        public void ConnectToHub(string playerName)
        {
            
            var query = from c in PlayerList
                        where c.ConnectionId == Context.ConnectionId || c.PlayerName == playerName
                        select c.ConnectionId;
            if (query.Count()==0)
            {
                PlayerList.Add(new Player
                {
                    ConnectionId = Context.ConnectionId,
                    PlayerName = playerName
                });
                Clients.Client(Context.ConnectionId).getOnlinePlayerNum(PlayerList.Count);
                PlayerList.ForEach(x => {
                    Clients.AllExcept(Context.ConnectionId).getOnlinePlayerNum(PlayerList.Count);
                });             
            }
            else
            {
                Clients.Client(Context.ConnectionId).duplicateConnectionId();
            }           
        }        
    }
}