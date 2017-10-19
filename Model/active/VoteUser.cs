using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.active
{
    public class VoteUser
    {
        public string bNo { get; set; }
        public string Contact { get; set; }
        public string Mobile { get; set; }
        public string Img_one { get; set; }
        public string Img_home { get; set; }
        public int uid { get; set; }
        public string openId { get; set; }
        public DateTime addOn { get; set; }
        public int enable { get; set; }
        public int voteNum { get; set; }
    }
}
