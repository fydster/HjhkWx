using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Model.Basic
{
    public class Order
    {
        public int id { get; set; }
        public string Order_no { get; set; }
        public string CallType { get; set; }
        public int Order_type { get; set; }
        public string Order_LeiBie { get; set; }
        public int Fliht_type { get; set; }
        public string Fliht_no { get; set; }
        public string Fliht_no_back { get; set; }
        public string Fliht_interval { get; set; }
        public string Fliht_interval_back { get; set; }
        public string Fliht_from { get; set; }
        public string Fliht_from_back { get; set; }
        public string Fliht_to { get; set; }
        public string Fliht_T { get; set; }
        public string Fliht_T_back { get; set; }
        public string Fliht_to_back { get; set; }
        public DateTime Fliht_date { get; set; }
        public DateTime Fliht_date_back { get; set; }
        public string Fliht_to_time { get; set; }
        public string Fliht_time_to_back { get; set; }
        public string Fliht_class { get; set; }
        public string Fliht_class_back { get; set; }
        public string Fliht_rebate { get; set; }
        public string Fliht_rebate_back { get; set; }
        public int Fare_num { get; set; }
        public int ticket_count { get; set; }
        public string User_name { get; set; }
        public string Com_name { get; set; }
        public string User_tel { get; set; }
        public string Msg_tel { get; set; }
        public Double jp_total_price { get; set; }
        public int jj_total_price { get; set; }
        public int ry_total_price { get; set; }
        public int bx_total_price { get; set; }
        public Double total_price { get; set; }
        public string Send_type { get; set; }
        public string Pay_type { get; set; }
        public string Record_no { get; set; }
        public DateTime Record_time { get; set; }
        public string Other { get; set; }
        public string Pnr { get; set; }
        public string Pnr_back { get; set; }
        public int Order_state { get; set; }
        public string WebOrderNo { get; set; }
        public int webState { get; set; }
        public int cjfbx_total_price { get; set; }
        public string cjfbx_remark { get; set; }
        public int service_total_price { get; set; }
        public string user_card_mobile { get; set; }
        public int Money_return { get; set; }
        public int ZuoHao_state { get; set; }
        public int IsPass { get; set; }
        public string order_pass { get; set; }
        public int vtg_state { get; set; }
        public int isSendFirst { get; set; }
    }
}
