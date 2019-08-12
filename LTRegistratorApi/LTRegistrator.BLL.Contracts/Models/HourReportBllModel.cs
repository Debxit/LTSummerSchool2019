﻿using System;
using System.Collections.Generic;
using System.Text;

namespace LTRegistrator.BLL.Contracts.Models
{
    public class HourReportBllModel
    {
        public ICollection<HourReportUserBllModel> Users { get; set; }
        public ICollection<HourReportProjectBllModel> Projects { get; set; }
    }

    public class HourReportUserBllModel
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public string LastName { get; set; }
        public double Rate { get; set; }
        public double NormHours { get; set; }
        public ICollection<HourReportProjectBllModel> Projects { get; set; }
    }

    public class HourReportProjectBllModel
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public double Hours { get; set; }
    }
}
