using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class CountAll
    {
        public DateTime sDate { get; set; }
        public int userCount { get; set; }
        public int userCountNo { get; set; }
        public int searchCount { get; set; }
        public int trainSearchCount { get; set; }
        public int shareF { get; set; }
        public int shareP { get; set; }
        public int airOrderCount { get; set; }
        public int airFareCount { get; set; }
        public int trainOrderCount { get; set; }
        public int trainFareCount { get; set; }
        public int hotelOrderCount { get; set; }
        public int hotelSearchCount { get; set; }
        public int hotelRoomsCount { get; set; }
        public List<parterCount> lp { get; set; }
    }

    public class parterCount
    {
        public int pid { get; set; }
        public string pName { get; set; }
        public int userCount { get; set; }
        public int userCountNo { get; set; }
        public int searchCount { get; set; }
        public int trainOrderCount { get; set; }
        public int airOrderCount { get; set; }
    }
}
