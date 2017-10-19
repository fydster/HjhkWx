using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.active
{
    public class Student
    {
        public int id { get; set; }
        public int uId { get; set; }
        public string nickName { get; set; }
        public string photoUrl { get; set; }
        public string srcProvice { get; set; }
        public string srcCity { get; set; }
        public string toProvice { get; set; }
        public string toCity { get; set; }
        public string contact { get; set; }
        public string mobile { get; set; }
        public string colage { get; set; }
        public int enable { get; set; }
        public int state { get; set; }
        public DateTime addOn { get; set; }
        public string memo { get; set; }
        public int sType { get; set; }
    }
}
