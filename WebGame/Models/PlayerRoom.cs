using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebGame.Models
{
    public class PlayerRoom
    {
        public int Id { get; set; }
        public string Name { get; set; }   
        public int TotalLimit { get; set; }
        public List<Player> PlayerList { get; set; }
    }
}