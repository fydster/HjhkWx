using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace Train
{
    public class _Train_city : DbCenter
    {
        public string url = "dts/TrainSearch/TrainStationList";

        /// <summary>
        /// 获取城市列表
        /// </summary>
        /// <returns></returns>
        public string GetList()
        {
            List<train_para> lt = new List<train_para>();
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
