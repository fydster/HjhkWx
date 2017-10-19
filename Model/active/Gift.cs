using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.active
{
    public class Gift
    {
        public int id { get; set; }
        public int uId { get; set; }
        public int state { get; set; }
        public string streamNo { get; set; }
        public int giftType { get; set; }
        public string giftName { get; set; }
        public DateTime addOn { get; set; }
        public DateTime useOn { get; set; }
    }
}
