using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class QpBook
    {
        public string queryKey { get; set; }
        public string outOrderNo { get; set; }
        public string trainNo { get; set; }
        public string seatClassCode { get; set; }
        public string mainTrainNo { get; set; }
        public string mainSeatClass { get; set; }
        public string fromStation { get; set; }
        public string toStation { get; set; }
        public string departDate { get; set; }
        public string closeTime { get; set; }
        public string isProduction { get; set; }
        public string ticketModel { get; set; }
        public string accountNo { get; set; }
        public string accountPwd { get; set; }
        public string acceptNoSeat { get; set; }
        public contactInfo contactInfo { get; set; }
        public List<passengers> passengers { get; set; }
    }
}
