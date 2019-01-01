﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
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
                playerList.RemoveAt(playerList.FindIndex(x => x.ConnectionId == Context.ConnectionId));
                GetOnlinePlayerNumber();
            }
            return base.OnDisconnected(stopCalled);
        }
        public void GetOnlinePlayerNumber()
        {
            Clients.Client(Context.ConnectionId).getOnlinePlayerNumber(playerList.Count);
            playerList.ForEach(x => {
                Clients.AllExcept(Context.ConnectionId).getOnlinePlayerNumber(playerList.Count);
            });
        }
        public void ConnectToHub(string playerName)
        {
         
            var query = from c in playerList
                        where c.ConnectionId == Context.ConnectionId || c.PlayerName == playerName
                        select c.ConnectionId;
            if (query.Count()==0)
            {
                playerList.Add(new Player
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

        public JsonResult CreateRoom(string roomName)
        {           
            bool flag = roomList.Add(new PlayerRoom {
                TotalLimit = 5,
                Name = roomName,
                PlayerList = new List<Player>(),
            });
            if (flag)
            {
                var query = roomList.FindAll(x=>string.Equals(x.Name,roomName));
                var queryPlayer = playerList.FindAll(x=>string.Equals(x.ConnectionId,Context.ConnectionId));
                if (query!=null &&  query.Count>0)
                {
                    if (queryPlayer != null && queryPlayer.Count>0)
                    {
                        query.FirstOrDefault().PlayerList.Add(queryPlayer.FirstOrDefault());
                        Groups.Add(Context.ConnectionId, roomName);
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
    }
}