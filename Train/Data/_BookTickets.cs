using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Train;

namespace Train
{
    public class _BookTickets
    {
        public string url = "dto/trainOrder/bookTickets";

        /// <summary>
        /// 创建订单
        /// </summary>
        /// <returns></returns>
        public string bookTickets(string jsonString)
        {
            List<train_para> lt = new List<train_para>();
            //订单信息
            lt.Add(new train_para { key = "param", value = jsonString });

            train_get tg = new train_get
            {
                url = url,
                para = lt
            };
            string result = new _Train().GetResult(tg,"POST");
            return result;
        }
    }
}
