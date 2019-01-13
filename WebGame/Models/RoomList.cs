using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebGame.Models
{
    public class RoomList<T> :List<PlayerRoom>
    {
        
        public new bool Add(PlayerRoom obj)
        {
            var query = base.FindAll(x => string.Equals(x.Name, obj.Name));
            if (query!=null && query.Count>0)
            {
                return false;
            }
            else
            {
                base.Add(obj);
                return true;
            }
        }
        public bool PlayerOnDisconnect(Player player)
        {
            Predicate<Player> predicate = i => i.Equals(player);
            bool isInRoom = false;
            this.ForEach(x=> {
                if (x.PlayerList.FindIndex(predicate)!=-1)
                {
                    x.PlayerList.Remove(player);
                    isInRoom = true;
                }
            });
            return isInRoom;
        }
        public void CleanRoom()
        {
            lock (this)
            {
                this.RemoveAll(x =>  x.PlayerList.Count <= 0);
            }
        }
    }
}