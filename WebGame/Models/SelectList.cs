using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebGame.Models
{
    public class SelectList<T> : List<T>
    {
        public new bool Add(T obj)
        {
            if (obj != null&&!base.Contains(obj))
            {
                base.Add(obj);
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}