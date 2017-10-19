using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.active
{
    public class Vote
    {
        public int id { get; set; }
        public int uid { get; set; }
        public string bNo { get; set; }
        public string nickName { get; set; }
        public string photoUrl { get; set; }
        public DateTime addOn { get; set; }

    }

    public class VotePm
    {
        public string bNo
        {
            get;
            set;
        }
        public int num
        {
            get;
            set;
        }
    }


    public class VotePmInfo
    {
        public string bNo { get; set; }
        public int num { get; set; }
        public string contact { get; set; }
    }
}
