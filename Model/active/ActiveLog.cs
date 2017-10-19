using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.active
{
    public class ActiveLog
    {
        public int id { get; set; }
        public int uId { get; set; }
        public string nickName { get; set; }
        public string photoUrl { get; set; }
        public int activeId { get; set; }
        public DateTime addOn { get; set; }
        public DateTime fundOn { get; set; }
        public int state { get; set; }
    }
}
