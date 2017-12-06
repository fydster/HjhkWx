using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.travel
{
    public class travelProduct
    {
        public int id { get; set; }
        public int cId { get; set; }
        public string title { get; set; }
        public string imgUrl { get; set; }
        public string imgUrlHb { get; set; }
        public string contents { get; set; }
        public string content_xc { get; set; }
        public string content_fy { get; set; }
        public string content_xz { get; set; }
        public int isHot { get; set; }
        public int isTj { get; set; }
        public int isHref { get; set; }
        public string hrefUrl { get; set; }
        public DateTime addOn { get; set; }
        public int adminId { get; set; }
        public int enable { get; set; }
        public string desp { get; set; }
        public int price { get; set; }
    }
}
