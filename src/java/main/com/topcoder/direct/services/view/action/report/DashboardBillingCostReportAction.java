/*
 * Copyright (C) 2011 TopCoder Inc., All Rights Reserved.
 */
package com.topcoder.direct.services.view.action.report;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.topcoder.clients.invoices.dao.LookupDAO;
import com.topcoder.direct.services.view.dto.dashboard.billingcostreport.BillingCostReportDTO;
import com.topcoder.direct.services.view.dto.dashboard.billingcostreport.BillingCostReportEntryDTO;
import com.topcoder.direct.services.view.dto.dashboard.billingcostreport.PaymentType;
import com.topcoder.direct.services.view.form.DashboardBillingCostReportForm;
import com.topcoder.direct.services.view.util.DataProvider;
import com.topcoder.direct.services.view.util.DirectUtils;

/**
 * <p>A <code>Struts</code> action to be used for handling the requests for viewing the billing cost report.</p>
 * <p/>
 *
 * <p>
 * Version 1.1 (TC Cockpit Permission and Report Update One) change log:
 * <ol>
 *   <li>This class has been refactoring. It's extended from <code>DashboardReportBaseAction</code>. The base class will
 *   parse and validate the parameters, prepare for the common data used by the report page.</li>
 *   <li>Updated method {@link #executeAction()()} to pass <code>TCSubject</code> object to method
 *     <code>DataProvided.getDashboardBillingCostReport</code> which will use <code>TCSubject</code> to
 *     check the user's permission.</li>
 * </ol>
 * </p>
 * 
 * <p>
 * Version 1.1 (TC Accounting Tracking Invoiced Payments) change notes:
 * <ol>
 *   <li>Added {@link #invoiceRecordDAO} and {@link #lookupDAO} fields. Also the setters/getters were added.</li>
 *   <li>Updated {@link #executeAction()} method to pass extra parameters to <code>DataProvider.getDashboardBillingCostReport</code>.</li>
 * </ol>
 * </p>
 * 
 * <p>
 * Version 1.2 (TC Accounting Tracking Invoiced Payments Part 2) change notes:
 * <ol>
 *   <li>Added {@link #getCurrentDate()} method to get the current date of server.</li>
 *   <li>Removed field <code>invoiceRecordDAO</code>.</li>
 *   <li>Updated method {@link #executeAction()} to remove invoiceRecordDAO from parameter list
 *   when calling DataProvider.getDashboardBillingCostReport.</li>
 * </ol>
 * </p>
 * 
 * @author Blues, TCSASSEMBER
 * @version 1.2 (TC Cockpit Billing Cost Report Assembly)
 */
public class DashboardBillingCostReportAction extends DashboardReportBaseAction<DashboardBillingCostReportForm, BillingCostReportDTO> {

    /**
     * All the payment types used by billing cost report. There are 10 payment types used for billing cost report. it's
     * initialized in the static constructor of this action class.
     */
    private static final Map<Long, String> BILLING_COST_REPORT_PAYMENT_TYPES;

    /**
     * All the payment types used by billing cost report. There are 10 payment types used for billing cost report. it's
     * initialized in the static constructor of this action class.
     */
    private static final Map<String, Long> BILLING_COST_REPORT_PAYMENT_TYPES_IDS;

    /**
     * Status constructor of this action.
     */
    static {

        // initialize the payment types mappings
        BILLING_COST_REPORT_PAYMENT_TYPES = new HashMap<Long, String>();
        BILLING_COST_REPORT_PAYMENT_TYPES_IDS = new HashMap<String, Long>();
        PaymentType[] allPaymentTypes = PaymentType.values();
        for (PaymentType pt : allPaymentTypes) {
            BILLING_COST_REPORT_PAYMENT_TYPES.put(pt.getId(), pt.getDescription());
            BILLING_COST_REPORT_PAYMENT_TYPES_IDS.put(pt.getDescription().toLowerCase(), pt.getId());
        }
    }
    
    /**
     * <p>The instance of <code>LookupDAO</code>. Used to retrieve <code>InvoiceType</code> data. Will
     * be injected by Spring IoC.</p>
     * 
     * @since 1.1
     */
    private LookupDAO lookupDAO;

    /**
     * <p>Constructs new <code>DashboardBillingCostReportAction</code> instance</p>
     */
    public DashboardBillingCostReportAction() {
        super();
        
        setViewData(new BillingCostReportDTO());
        setFormData(new DashboardBillingCostReportForm());
    }

    /**
     * <p>Sets the instance of <code>LookupDAO</code>.</p>
     * 
     * @param lookupDAO the instance of <code>LookupDAO</code>.
     * @since 1.1
     */
    public void setLookupDAO(LookupDAO lookupDAO) {
        this.lookupDAO = lookupDAO;
    }
    
    /**
     * <p>Gets the current date.</p>
     *  
     * @return the current date
     * @since 1.2
     */
    public Date getCurrentDate() {
        return new Date();
    }
    
    /**
     * <p>Handles the incoming request.
     *
     * @return <code>SUCCESS</code> if request is to be forwarded to respective view or <code>download</code> if
     *         response is to be written to client directly.
     */
    @Override
    public String execute() throws Exception {
        String result = super.execute();
        if (SUCCESS.equals(result)) {
            if (getFormData().isExcel()) {
                return "download";
            }
        }
        return result;
    }

    /**
     * <p>Handles the incoming request. Retrieves data for Billing Cost Report and binds it to request.</p>
     *
     * @throws Exception if an unexpected error occurs.
     */
    @Override
    protected void executeAction() throws Exception {
        super.executeAction();
        
        if (hasActionErrors()) {
            return;
        }

        // Analyze form parameters
        DashboardBillingCostReportForm form = getFormData();

        long projectId = form.getProjectId();
        long billingAccountId = form.getBillingAccountId();
        long customerId = form.getCustomerId();
        long[] statusIds = form.getStatusIds();
        long[] paymentTypeIds = form.getPaymentTypeIds();

        long contestId = 0;

        Date startDate = DirectUtils.getDate(form.getStartDate());
        Date endDate = DirectUtils.getDate(form.getEndDate());

        boolean isFirstCall = getViewData().isShowJustForm();

        // If payment type IDs are not specified then use all the payment types by default
        boolean  paymentTypeIdsAreSet = (paymentTypeIds != null) && (paymentTypeIds.length > 0);
        if (isFirstCall && !paymentTypeIdsAreSet) {
            // set to all payment types by default
            PaymentType[] paymentTypes = PaymentType.values();
            long[] allPaymentTypeIds = new long[paymentTypes.length];
            for(int i = 0; i < allPaymentTypeIds.length; ++i) {
                allPaymentTypeIds[i] = paymentTypes[i].getId();
            }
            form.setPaymentTypeIds(allPaymentTypeIds);
            paymentTypeIdsAreSet = true;
        }

        // set all the payment types to view data to populate payment type selection
        getViewData().setPaymentTypes(BILLING_COST_REPORT_PAYMENT_TYPES);

        if (!getViewData().isShowJustForm() && form.getContestId() != null && form.getContestId().trim().length() > 0) {

            try {
                contestId = Long.parseLong(form.getContestId());
            } catch (Exception ex) {
                addActionError("Contest Id is not valid");
                return;
            }
        }

        // parse out studio categories ids
        List<Long> softwareProjectCategoriesList = new ArrayList<Long>();
        List<Long> studioProjectCategoriesList = new ArrayList<Long>();

        for (Long categoriesId : form.getProjectCategoryIds()) {
            if (categoriesId > 100) {
                studioProjectCategoriesList.add(categoriesId - 100);
            } else softwareProjectCategoriesList.add(categoriesId);
        }

        long[] softwareProjectCategories = DirectUtils.covertLongListToArray(softwareProjectCategoriesList);
        long[] studioProjectCategories = DirectUtils.covertLongListToArray(studioProjectCategoriesList);

        // If necessary get and process report data
        if (!getViewData().isShowJustForm()) {

            Map<Long, List<BillingCostReportEntryDTO>> billingCosts = DataProvider.getDashboardBillingCostReport
                    (lookupDAO.getAllInvoiceTypes(), getCurrentUser(), projectId,
                    softwareProjectCategories, studioProjectCategories, paymentTypeIds,
                    customerId, billingAccountId, statusIds, contestId, form.getInvoiceNumber(), startDate, endDate,
                    REPORT_CONTEST_STATUS_IDS, BILLING_COST_REPORT_PAYMENT_TYPES_IDS);

            List<BillingCostReportEntryDTO> viewData = new ArrayList<BillingCostReportEntryDTO>();

            for(List<BillingCostReportEntryDTO> contestEntries : billingCosts.values()) {
                viewData.addAll(contestEntries);
            }

            Collections.sort(viewData, new Comparator<BillingCostReportEntryDTO>() {
                public int compare(BillingCostReportEntryDTO one, BillingCostReportEntryDTO other) {
                    return (int) (one.getContest().getId() - other.getContest().getId());
                }
            });

            getViewData().setEntries(viewData);

        }
        
        this.getViewData().setCanProcessInvoices(DirectUtils.canPerformInvoiceRecords(getCurrentUser()));
    }
}
