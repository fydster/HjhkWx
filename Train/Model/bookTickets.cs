using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class bookTickets
    {
        public string queryKey { get; set; }
        public string journeyType { get; set; }
        public string userAccount { get; set; }
        public string outOrderNo { get; set; }
        public string trainNo { get; set; }
        public string fromStation { get; set; }
        public string toStation { get; set; }
        public int isPost { get; set; }
        public int isOnLine { get; set; }
        public int noticeType { get; set; }
        public string batchNumber { get; set; }
        public string isProduction { get; set; }
        public string ticketModel { get; set; }
        public string accountNo { get; set; }
        public string accountPwd { get; set; }
        public string acceptNoSeat { get; set; }
        public contactInfo contactInfo { get; set; }
        public postalInfo postalInfo { get; set; }
        public List<passengers> passengers { get; set; }
    }

    public class contactInfo
    {
        public string person { get; set; }
        public string cellphone { get; set; }
        public string email { get; set; }
    }

    public class postalInfo
    {
        public string person { get; set; }
        public string cellphone { get; set; }
        public string province { get; set; }
        public string city { get; set; }
        public string district { get; set; }
        public string address { get; set; }
        public string zip { get; set; }
    }

    public class passengers
    {
        public string passengerType { get; set; }
        public string passengerName { get; set; }
        public string idType { get; set; }
        public string idCard { get; set; }
        public string birthday { get; set; }
        public int insureCount { get; set; }
        public int insurePrice { get; set; }
        public string insurNo { get; set; }
        public string sex { get; set; }
        public string seatClass { get; set; }
        public string ticketPrice { get; set; }
    }
}
