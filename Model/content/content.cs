using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model
{
    public class content
    {
        public int id { get; set; }
        public int cId { get; set; }
        public string title { get; set; }
        public int cType { get; set; }
        public string imgUrl { get; set; }
        public int isHref { get; set; }
        public string hrefUrl { get; set; }
        public string contents { get; set; }
        public int isHot { get; set; }
        public int isCheck { get; set; }
        public string source { get; set; }
        public DateTime cDate { get; set; }
        public DateTime addOn { get; set; }
        public int adminId { get; set; }
        public int checkId { get; set; }
        public int enable { get; set; }
        public string wp_tel { get; set; }
        public string wp_addr { get; set; }
        public string wp_contact { get; set; }
    }
}
