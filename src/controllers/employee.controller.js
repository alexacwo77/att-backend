const employeeService = require("../services/employee.service");
const { success, error } = require("../utils/response");

exports.getEmployees = async (req, res) => {
    try {

        const employees = await employeeService.getEmployees(
            req.query.search
        );

        return success(res, {
            employees,
        });

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.getEmployeeById = async (req, res) => {
    try {

        const employee = await employeeService.getEmployeeById(
            req.params.id
        );

        if (!employee) {
            return error(res, "Employee not found", 404);
        }

        return success(res, employee);

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.createEmployee = async (req, res) => {
    try {

        const employee = await employeeService.createEmployee(
            req.body
        );

        return success(res, {
            employee_id: employee.id,
        }, 201);

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.updateEmployee = async (req, res) => {
    try {

        await employeeService.updateEmployee(
            req.params.id,
            req.body
        );

        return success(res, {});

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};

exports.deleteEmployee = async (req, res) => {
    try {

        await employeeService.deleteEmployee(
            req.params.id
        );

        return success(res, {});

    } catch (err) {
        return error(res, "Server error: " + err.message);
    }
};