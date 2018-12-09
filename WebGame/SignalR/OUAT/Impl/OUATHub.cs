using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using WebGame.Models;
using WebGame.SignalR.OUAT;

namespace WebGame.SignalR
{
    [HubName("oUATHub")]
    public class OUATHub : Hub<IOUATClient>, IOUATHub
    {
        public static List<Player> PlayerList = new List<Player>();
        public override Task OnDisconnected(bool stopCalled)
        {
            PlayerList.RemoveAt(PlayerList.FindIndex(x => x.ConnectionId== Context.ConnectionId));
            GetOnlinePlayerNumber();
            return base.OnDisconnected(stopCalled);
        }
        public void GetOnlinePlayerNumber()
        {
            Clients.Client(Context.ConnectionId).getOnlinePlayerNumber(PlayerList.Count);
            PlayerList.ForEach(x => {
                Clients.AllExcept(Context.ConnectionId).getOnlinePlayerNumber(PlayerList.Count);
            });
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
                GetOnlinePlayerNumber();
            }
            else
            {
               Clients.Client(Context.ConnectionId).duplicateConnectionId();
            }
        }
    }
}