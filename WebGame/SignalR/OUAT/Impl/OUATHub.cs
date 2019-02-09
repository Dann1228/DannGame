using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using WebGame.Models;
using WebGame.SignalR.OUAT;
using WebLib.Utils;

namespace WebGame.SignalR
{
    [HubName("oUATHub")]
    public class OUATHub : Hub<IOUATClient>, IOUATHub
    {
        public static List<Player> playerList = new List<Player>();
        public static RoomList<PlayerRoom> roomList = new RoomList<PlayerRoom>();

        public override Task OnDisconnected(bool stopCalled)
        {
            int index = playerList.FindIndex(x => x.ConnectionId == Context.ConnectionId);           
            if (index != -1)
            {
                Player disconnectPlayer = playerList[index];
                playerList.RemoveAt(playerList.FindIndex(x => x.ConnectionId == Context.ConnectionId));
                if(roomList.PlayerOnDisconnect(disconnectPlayer))
                {              
                    this.CurrentRoomList();
                }
                GetOnlinePlayerNumber();
            }
            
            return base.OnDisconnected(stopCalled);
        }
        //public JsonResult GetOnlinePlayerNumberSelf()
        //{
        //    return new JsonResult { Data = new { data = playerList.Count } };
        //}
        public void GetOnlinePlayerNumber()
        {
            Clients.All.getOnlinePlayerNumber(playerList.Count);
            //Clients.Client(Context.ConnectionId).getOnlinePlayerNumber(playerList.Count);
            //playerList.ForEach(x => {
            //    Clients.AllExcept(Context.ConnectionId).getOnlinePlayerNumber(playerList.Count);
            //});
        }
        public void ConnectToHub(Player player)
        {
         
            var query = from c in playerList
                        where c.ConnectionId == Context.ConnectionId || c.PlayerName == player.PlayerName
                        select c.ConnectionId;
            if (query.Count()==0)
            {
                playerList.Add(new Player
                {
                    ConnectionId = Context.ConnectionId,
                    PlayerName = player.PlayerName,
                    ControllerName = player.ControllerName,
                    IsConnecting = true,
                });
                GetOnlinePlayerNumber();
            }
            else
            {
               Clients.Client(Context.ConnectionId).duplicateConnectionId();
            }
        }
        public JsonResult CreateRoom(PlayerRoom room)
        {           
            bool flag = roomList.Add(new PlayerRoom {
                TotalLimit = room.TotalLimit,
                Name = room.Name,
                PlayerList = new List<Player>(),
            });
            if (flag)
            {
                var query = roomList.FindAll(x=>string.Equals(x.Name, room.Name));
                var queryPlayer = playerList.FindAll(x=>string.Equals(x.ConnectionId,Context.ConnectionId));
                if (query!=null &&  query.Count>0)
                {
                    if (queryPlayer != null && queryPlayer.Count>0)
                    {
                        queryPlayer.FirstOrDefault().RoomName = room.Name;
                        query.FirstOrDefault().PlayerList.Add(queryPlayer.FirstOrDefault());
                        Groups.Add(Context.ConnectionId, room.Name);
                         CurrentRoomList();
                        return new JsonResult { Data = new { result = true, data = JavaScriptObjectParser.Parse(roomList) } };
                    }
                    else
                    {
                        return  new JsonResult { Data =new { result = false } };
                    }
                }
                else
                {
                    return new JsonResult { Data = new { result = false } };
                }
            }
            else
            {
                return new JsonResult { Data = new { result = false } };
            }
        }
        public JsonResult CurrentRoomList()
        {
            roomList.CleanRoom();
            List<string> inLobby = new List<string>();
            foreach (var player in playerList)
            {
                if (string.IsNullOrEmpty(player.RoomName))
                {
                    inLobby.Add(player.ConnectionId);
                }
            }
            if (roomList.Count > 0)
            {
                Clients.Clients(inLobby.ToArray()).CurrentRoomList(new JsonResult { Data = new { data = JavaScriptObjectParser.Parse(roomList),hasRoom = true } });
            }
            else
            {
                //foreach (var client in inLobby)
                //{
                //    Clients.Client(client).CurrentRoomList(new JsonResult { Data = new { hasRoom = false } });
                //}
                Clients.Clients(inLobby.ToArray()).CurrentRoomList(new JsonResult { Data = new { hasRoom = false } });
            }
            // Clients.AllExcept(inRoomIds.ToArray()).CurrentRoomList(new JsonResult { Data = new { data = JavaScriptObjectParser.Parse(roomList) } });
            return new JsonResult { Data=new { data = JavaScriptObjectParser.Parse(roomList)} };
        }
        public PlayerRoom  SearchRoom (Player player)
        {
            List<PlayerRoom> room = new List<PlayerRoom>();
            if (player != null && player.RoomName != string.Empty)
            {
                room =( from c in OUATHub.roomList
                            where c.Name == player.RoomName
                            select new PlayerRoom
                            {
                                Name = c.Name,
                                TotalLimit = c.TotalLimit,
                                PlayerList = c.PlayerList,
                                Id = c.Id,
                                TotalLimit_Str = c.TotalLimit_Str,
                            }).ToList();
            }
            return room.FirstOrDefault();
        }

        public JsonResult EnterRoom(Player player)
        {
            var query = SearchRoom(player);
            if (query != null &&
                query.PlayerList.Count < query.TotalLimit)
            {
                var queryPlayer = playerList.Find(x=>string.Equals(x.PlayerName,player.PlayerName));
                if (queryPlayer != null)
                {
                    queryPlayer.RoomName = player.RoomName;
                    query.PlayerList.Add(queryPlayer);
                }
                CurrentRoomList();
                return new JsonResult { Data = new { result = true } };
            }
            else
            {
                return new JsonResult { Data = new { result = false } };
            }
        }
        public void CheckIsInRoom(Player player)
        {
            var query = SearchRoom(player);
            if (query != null)
            {
                var queryPlayer = playerList.Find(x => string.Equals(x.PlayerName, player.PlayerName));
                if (queryPlayer != null)
                {
                    query.PlayerList.Remove(queryPlayer);
                    queryPlayer.RoomName = string.Empty;
                    CurrentRoomList();
                }
            }
        }
        public void BackToLobby(Player player)
        {
            CheckIsInRoom(player);
        }
    }
}