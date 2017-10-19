using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Train
{
    public class _Train_select
    {
        public string url = "dts/TrainSearch/train";

        /// <summary>
        /// 查询车票
        /// </summary>
        /// <returns></returns>
        public string Select(string sCity,string tCity,string sDate,int sType)
        {
            List<train_para> lt = new List<train_para>();
            //出发
            lt.Add(new train_para { key = "fromStation", value = sCity });
            //到达
            lt.Add(new train_para { key = "toStation", value = tCity });
            //日期
            lt.Add(new train_para { key = "trainDate", value = sDate });
            //类型
            lt.Add(new train_para { key = "ticketType", value = sType.ToString() });

            train_get tg = new train_get
            {
                url = url,
                para = lt
            };
            string result = new _Train().GetResult(tg,"GET");
            return result;
        }
    }
}
