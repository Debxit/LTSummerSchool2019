﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LTRegistrator.BLL.Contracts.Dtos;

namespace LTRegistrator.BLL.Contracts.Contracts
{
    public interface IEmployeeService
    {
        Task<Response<EmployeeDto>> GetByIdAsync(Guid id);
        Task<Response<EmployeeDto>> AddLeavesAsync(Guid userId, ICollection<LeaveDto> leaves);
        Task<Response<EmployeeDto>> UpdateLeavesAsync(Guid userId, ICollection<LeaveDto> leaves);
        Task<Response<EmployeeDto>> DeleteLeavesAsync(Guid userId, ICollection<Guid> leaveIds);
    }
}