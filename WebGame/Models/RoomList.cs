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
    }
}