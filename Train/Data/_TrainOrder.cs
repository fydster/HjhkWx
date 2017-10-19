using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data;

namespace Train
{
    public class _TrainOrder:DbCenter
    {
        public Double GetOrderPrice(string orderNo)
        {
            Double OrderPrice = 0;
            try
            {
                OrderPrice = Convert.ToDouble(helper.GetOne("select totalPrice from t_train_order where orderNo = '" + orderNo + "'"));
            }
            catch
            {
                OrderPrice = 0;
            }
            return OrderPrice;
        }

        public trainOrder GetTrainOrderInfo(string orderNo)
        {
            trainOrder to = null;
            string sql = "select * from t_train_order where orderNo = '" + orderNo + "'";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        to = new trainOrder
                        {
                            outOrderNo = r["outOrderNo"].ToString(),
                            state = Convert.ToInt16(r["state"]),
                            orderNo = orderNo,
                            addOn = Convert.ToDateTime(r["addOn"]),
                            ticketPrice = Convert.ToDouble(r["ticketPrice"]),
                            totalPrice = Convert.ToDouble(r["totalPrice"]),
                            insurePrice = Convert.ToDouble(r["insurePrice"]),
                            refundPrice = Convert.ToDouble(r["refundPrice"]),
                            uId = Convert.ToInt32(r["uId"]),
                            contact = r["contact"].ToString(),
                            mobile = r["mobile"].ToString(),
                            fareNum = Convert.ToInt16(r["fareNum"]),
                            isPay = Convert.ToInt16(r["isPay"])
                        };
                    }
                }
            }
            return to;
        }

        public trainOrderinfo GetTrainOrderInfoForAll(string orderNo)
        {
            trainOrderinfo to = null;
            string sql = "select * from t_train_order where orderNo = '" + orderNo + "'";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        to = new trainOrderinfo
                        {
                            outOrderNo = r["outOrderNo"].ToString(),
                            state = Convert.ToInt16(r["state"]),
                            orderNo = r["orderNo"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            ticketPrice = Convert.ToDouble(r["ticketPrice"]),
                            totalPrice = Convert.ToDouble(r["totalPrice"]),
                            insurePrice = Convert.ToDouble(r["insurePrice"]),
                            uId = Convert.ToInt32(r["uId"]),
                            contact = r["contact"].ToString(),
                            mobile = r["mobile"].ToString(),
                            fareNum = Convert.ToInt16(r["fareNum"]),
                            isPay = Convert.ToInt16(r["isPay"])
                        };
                        to.trip = GetTrainTripList(to.orderNo);
                        to.fare = GetTrainFareList(to.orderNo);
                        to.log = GetTrainLogList(to.orderNo);
                    }
                }
            }
            return to;
        }

        public List<trainOrderinfo> GetTrainOrderList(int uid)
        {
            List<trainOrderinfo> lt = new List<trainOrderinfo>();
            string sql = "select * from t_train_order where uid = " + uid + " order by id desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        trainOrderinfo to = new trainOrderinfo
                        {
                            outOrderNo = r["outOrderNo"].ToString(),
                            state = Convert.ToInt16(r["state"]),
                            orderNo = r["orderNo"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            ticketPrice = Convert.ToDouble(r["ticketPrice"]),
                            totalPrice = Convert.ToDouble(r["totalPrice"]),
                            insurePrice = Convert.ToDouble(r["insurePrice"]),
                            uId = Convert.ToInt32(r["uId"]),
                            contact = r["contact"].ToString(),
                            mobile = r["mobile"].ToString(),
                            fareNum = Convert.ToInt16(r["fareNum"]),
                            isPay = Convert.ToInt16(r["isPay"])
                        };
                        to.trip = GetTrainTripList(to.orderNo);
                        to.fare = GetTrainFareList(to.orderNo);
                        //to.log = GetTrainLogList(to.orderNo);
                        lt.Add(to);
                    }
                }
            }
            return lt;
        }

        public List<trainFare> GetTrainFareList(string orderNo)
        {
            List<trainFare> lt = new List<trainFare>();
            string sql = "select * from t_train_fare where orderNo = '" + orderNo + "' order by id desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        try
                        {
                            trainFare to = new trainFare
                            {
                                id = Convert.ToInt32(r["id"]),
                                orderNo = r["orderNo"].ToString(),
                                addOn = Convert.ToDateTime(r["addOn"]),
                                birthday = Convert.ToDateTime(r["birthday"]),
                                idCard = r["idCard"].ToString(),
                                idType = Convert.ToInt16(r["idType"]),
                                passengerName = r["passengerName"].ToString(),
                                passengerType = Convert.ToInt16(r["passengerType"]),
                                passengerId = r["passengerId"].ToString(),
                                seatNo = r["seatNo"].ToString(),
                                price = Convert.ToDouble(r["price"]),
                                refundPrice = Convert.ToDouble(r["refundPrice"]),
                                insurePrice = Convert.ToInt16(r["insurePrice"]),
                                state = Convert.ToInt16(r["state"])
                            };
                            lt.Add(to);
                        }
                        catch{

                        }
                        
                    }
                }
            }
            return lt;
        }

        public List<trainTrip> GetTrainTripList(string orderNo)
        {
            List<trainTrip> lt = new List<trainTrip>();
            string sql = "select * from t_train_trip where orderNo = '" + orderNo + "' order by id desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        trainTrip to = new trainTrip
                        {
                            id = Convert.ToInt32(r["id"]),
                            orderNo = r["orderNo"].ToString(),
                            ticketPrice = Convert.ToDouble(r["ticketPrice"]),
                            fromCity = r["fromCity"].ToString(),
                            fromStation = r["fromStation"].ToString(),
                            toCity = r["toCity"].ToString(),
                            toStation = r["toStation"].ToString(),
                            trainNo = r["trainNo"].ToString(),
                            queryKey = r["queryKey"].ToString(),
                            seatClass = r["seatClass"].ToString(),
                            seatName = r["seatName"].ToString(),
                            tDate = Convert.ToDateTime(r["tDate"]),
                            sTime = r["sTime"].ToString(),
                            tTime = r["tTime"].ToString()
                        };
                        lt.Add(to);
                    }
                }
            }
            return lt;
        }

        public List<trainLog> GetTrainLogList(string orderNo)
        {
            List<trainLog> lt = new List<trainLog>();
            string sql = "select * from t_train_log where orderNo = '" + orderNo + "' order by id desc";
            using (DataTable dt = helper.GetDataTable(sql))
            {
                if (dt != null && dt.Rows.Count > 0)
                {
                    foreach (DataRow r in dt.Rows)
                    {
                        trainLog to = new trainLog
                        {
                            id = Convert.ToInt32(r["id"]),
                            orderNo = r["orderNo"].ToString(),
                            addOn = Convert.ToDateTime(r["addOn"]),
                            content = r["content"].ToString(),
                            lType = Convert.ToInt16(r["lType"])
                        };
                        lt.Add(to);
                    }
                }
            }
            return lt;
        }
    }
}
