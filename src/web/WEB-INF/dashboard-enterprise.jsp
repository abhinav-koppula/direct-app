<%--
  - Author: isv, tangzx, TCSDEVELOPER
  -
  - Version: 1.0.2 (Cockpit Enterprise Dashboard 2 Assembly 1.0)
  - Copyright (C) 2010 TopCoder Inc., All Rights Reserved.
  -
  - Description: This page renders the Enterprise Dashboard view.
  -
  - Version 1.0.1 - Direct - Project Dashboard Assembly Change Note
  - Show project status color in enterprise health table.
  -
  - Version 1.0.2 - Cockpit - Enterprise Dashboard 2 Assembly Change Note
  - Implemented latest changes to UI according to requirements
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/includes/taglibs.jsp" %>
<fmt:setLocale value="en_US"/>
<ui:dashboardPageType tab="overview"/>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <jsp:include page="includes/htmlhead.jsp"/>
    <link rel="stylesheet" href="/css/datepicker.css" media="all" type="text/css"/>
    <link rel="stylesheet" href="/css/dashboard-view.css" media="all" type="text/css"/>
    <link rel="stylesheet" href="/css/dashboard-enterprise.css" media="all" type="text/css"/>
    <link rel="stylesheet" href="/css/jquery.multiSelect.css" media="all" type="text/css"/>

    <!-- load the data for Charts -->
    <script type="text/javascript">
        var chartData =
        {
            contest:{
                column:["date", "Customer Avg Contest Duration", "Market Avg Contest Duration"],
                week:[
                <c:forEach items="${viewData.durationStats['WEEK']}" var="stat" varStatus="loop">
                    <c:if test="${loop.index > 0}">,</c:if>
                    {date:"<c:out value='${stat.timePeriodLabel}'/>",
                     customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                     tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                </c:forEach>
                ],
                month:[
                    <c:forEach items="${viewData.durationStats['MONTH']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ],
                quarter:[
                    <c:forEach items="${viewData.durationStats['QUARTER']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ],
                year:[
                    <c:forEach items="${viewData.durationStats['YEAR']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ]
            },
            cost:{
                column:["date", "Customer Avg Cost", "Market Avg Cost"],
                week:[
                    <c:forEach items="${viewData.costStats['WEEK']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ],
                month:[
                    <c:forEach items="${viewData.costStats['MONTH']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ],
                quarter:[
                    <c:forEach items="${viewData.costStats['QUARTER']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ],
                year:[
                    <c:forEach items="${viewData.costStats['YEAR']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ]
            },
            fulfill:{
                column:["date", "Customer Avg Fulfillment", "Market Avg Fulfillment"],
                week:[
                    <c:forEach items="${viewData.fulfillmentStats['WEEK']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ],
                month:[
                    <c:forEach items="${viewData.fulfillmentStats['MONTH']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ],
                quarter:[
                    <c:forEach items="${viewData.fulfillmentStats['QUARTER']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ],
                year:[
                    <c:forEach items="${viewData.fulfillmentStats['YEAR']}" var="stat" varStatus="loop">
                        <c:if test="${loop.index > 0}">,</c:if>
                        {date:"<c:out value='${stat.timePeriodLabel}'/>",
                         customer:<fmt:formatNumber value="${stat.clientValue}" pattern="0.##" />,
                         tc:<fmt:formatNumber value="${stat.overallValue}" pattern="0.##" />}
                    </c:forEach>
                ]
            }
        }
    </script>
    <!-- google visualization -->
    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript" src="/scripts/dashboard-chart.js"></script>
    <script type="text/javascript" src="/scripts/dashboard-view.js"></script>
    <script type="text/javascript" src="/scripts/dashboard-chart-range.js"></script>
    <script type="text/javascript" src="/scripts/jquery.dataTables.js"></script>
    <script type="text/javascript" src="/scripts/jquery.multiselect.js"></script>
</head>

<body id="page">
<div id="wrapper">
    <div id="wrapperInner">
        <div id="container">
            <div id="content">

                <jsp:include page="includes/header.jsp"/>

                <div id="mainContent">

                    <jsp:include page="includes/right.jsp"/>

                    <div id="area1"><!-- the main area -->
                        <div class="area1Content">

                            <div class="spaceWhite"></div>
                            <div class="dashboardTable">
                                <dl>
                                    <dt>
                                        <a href="javascript:void(0)" class="expand">Enterprise Health</a>
                                    </dt>
                                    <dd>
                                        <div class="dashboardTableBody">
                                            <table cellpadding="0" cellspacing="0" id="enterpriseHealthTable">
                                                <colgroup>
                                                    <col/>
                                                    <col width="17%"/>
                                                    <col width="17%"/>
                                                    <col width="17%"/>
                                                    <col width="17%"/>
                                                </colgroup>
                                                <tr>
                                                    <th class="first">Project</th>
                                                    <th>Average Contest Duration (Hours)</th>
                                                    <th>Average Cost per Contest</th>
                                                    <th>Total Project Cost</th>
                                                    <th>Average Fulfillment</th>
                                                </tr>
                                                <tbody>
                                                <c:forEach items="${viewData.projects}" var="project">
                                                    <tr>
                                                        <td class="first">
                                                            <a class="longWordsBreak ${project.projectStatusColor.name}"
                                                               href="projectOverview?formData.projectId=${project.project.id}">
                                                                <c:out value="${project.project.name}"/></a>
                                                        </td>
                                                        <td><span class="">
                                                        <fmt:formatNumber value="${project.averageContestDuration}"
                                                                          pattern="##0.##"/></span></td>
                                                        <td><span class="">
                                                        <fmt:formatNumber value="${project.averageCostPerContest}"
                                                                          pattern="$#,##0.00"/></span></td>
                                                        <td><span class="">
                                                        <fmt:formatNumber value="${project.totalProjectCost}"
                                                                          pattern="$#,##0.00"/></span></td>
                                                        <td><span class="">
                                                        <fmt:formatNumber value="${project.averageFulfillment}"
                                                                          pattern="##0.##"/>%</span></td>
                                                    </tr>
                                                </c:forEach>
                                                </tbody>
                                            </table>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                            <!-- End .dashboardTable -->

                            <div class="chartCollapse">
                                <a class="expand" href="javascript:void(0)">Chart View</a>
                                <div class="btnArea">
                                    <a href="javascript:" class="active btnGraph"></a>
                                    <a href="javascript:" class="btnTable"></a>
                                </div>
                            </div>
                            
                            <div class="chartSummary" style="text-align:center">
                                <div class="summaryContent">
                                   <span class="strongGreen">Summary</span>
                                    <strong>:</strong>
                                    Avg. Fulfillment : 
                                    <span id="avg1">
                                        <fmt:formatNumber value="${viewData.averageFulfillment}" pattern="##0.##"/>%
                                    </span>&nbsp;&nbsp;&nbsp;
                                    Avg. Cost : $ 
                                    <span id="avg2">
                                        <fmt:formatNumber value="${viewData.averageCost}" pattern="#,##0.00"/>
                                    </span>&nbsp;&nbsp;&nbsp;
                                    Avg. Duration : 
                                    <span id="avg3">
                                        <fmt:formatNumber value="${viewData.averageDuration}" pattern="##0.#"/> 
                                    </span> Days
                               
                                </div>
                                <span id="zoomMessage"></span>
                                <div class="summaryDate">
                                    <strong>Date :</strong>
                                    <fmt:parseDate value="${formData.startDate}" pattern="MM/dd/yyyy" var="startDate"/>
                                    <fmt:parseDate value="${formData.endDate}" pattern="MM/dd/yyyy" var="endDate"/>
                                    <span id="startDateLabel"><fmt:formatDate value="${startDate}" pattern="MMM dd,yyyy"/></span>
                                    -
                                    <span id="endDateLabel"><fmt:formatDate value="${endDate}" pattern="MMM dd,yyyy"/></span>
                                </div>
                            </div>
                            
                            <div class="graphArea">
                            <div class="visualization">
                                <s:form action="dashboardEnterprise" namespace="/" id="EnterpriseDashboardForm"
                                        method="get">
                                    <input type="hidden" name="zoomType" value="" id="zoomTypeInput"/>
                                    <div class="top">
                                        <div class="dateRange">
                                                <strong>Zoom</strong> :
                                                   <a href="WEEK" class="zoomLink">1 Week</a> &nbsp;
                                                   <a href="MONTH" class="zoomLink">1 Month</a>  &nbsp;
                                                   <a href="QUARTER" class="zoomLink">3 Month</a>  &nbsp;
                                                   <a href="HALF_OF_THE_YEAR" class="zoomLink">6 Month</a> &nbsp;
                                                   <a href="YEAR" class="zoomLink">YTD</a> &nbsp;
                                        </div>
                                        <div class="displaying">
                                            <span>Displaying :</span>
                                            <input type="radio" name="displaying" value="contest"/>
                                            <span>Contest Duration&nbsp;</span>
                                            <input type="radio" name="displaying" checked="checked" value="cost"/>
                                            <span>Cost&nbsp;</span>
                                            <input type="radio" name="displaying" value="fulfill"/>
                                            <span>Fulfillment</span>
                                        </div>
                                    </div>
                                    <!-- top -->

                                    <div class="chartWrapper">
                                        <div id="chart_div"></div>
                                        <div id="NoEnoughStats" class="hide">
                                            <p>NO ENOUGH STATISTICS TO RENDER THE CHART</p>
                                        </div>
                                    </div>    
                                    <!-- chart container-->

                                    <div class="filterLinkArea">
                                        <a class="fiterButton" href="javascript:">Filters</a>

                                        <div class="filterArea">

                                            <div class="filterProject">
                                                <span class="label">Project Name </span>
                                                <s:select list="viewData.projectsLookupMap" name="formData.projectIds" 
                                                          id="formData.projectIds"/>
                                            </div>
                                            
                                            <div class="firstRow">
                                                <div class="datePicker">
                                                    <div>
                                                        <span class="label">Start: </span>
                                                        <s:textfield name="formData.startDate" readonly="true" 
                                                                     id="startDateEnterprise" 
                                                                     cssClass="text date-pick"/>
                                                    </div>
                                                    <div>
                                                        <span class="label">End: </span>
                                                        <s:textfield name="formData.endDate" readonly="true" 
                                                                     id="endDateEnterprise" cssClass="text date-pick"/>
                                                    </div>
                                                </div>

                                                <div class="timeDimension">
                                                    <strong>Group By</strong><br/>
                                                    <select id="timeDimension">
                                                        <option value="">Select Time Dimension</option>
                                                        <option value="week">Week</option>
                                                        <option value="month" selected="selected">Month</option>
                                                        <option value="quarter">Quarter</option>
                                                        <option value="year">Year</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="spacer"></div>
                                            <div class="secondRow">
                                                <div class="filterContest">
                                                    <div class="columns contestType">
                                                        <strong>Contest Type</strong><br/>
                                                        <s:select list="viewData.projectCategories" multiple="true"
                                                                  cssClass="multiselect"
                                                                  id="formData.projectCategoryIds"
                                                                  name="formData.projectCategoryIds" size="5"/>
                                                    </div>

                                                    <div class="columns" id="customerNameFilter">
                                                        <strong>Customer Name</strong><br/>
                                                        <s:select list="viewData.clientAccounts" id="formData.customerIds"
                                                                  name="formData.customerIds" size="1"/>
                                                    </div>

                                                    <div class="columns">
                                                        <strong>Billing Account</strong><br/>
                                                        <s:select list="viewData.clientBillingProjects"
                                                                  id="formData.billingAccountIds"
                                                                  name="formData.billingAccountIds" size="1"/>
                                                    </div>

                                                    <div class="columns columnButton">
                                                        <a class="button6 applyButton" href="javascript:" 
                                                           id="enterpriseDashboardSubmit">
                                                            <span class="left"><span class="right">Apply</span></span>
                                                        </a>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <!-- End .filterArea -->
                                    </div>


                                    <div id="filterResultContainer"></div>

                                    <div id="validationErrors"></div>
                                    
                                </s:form>
                            </div>
                            <!-- End .visualization -->
                            </div>
                        </div>
                    </div>

                </div>
                <!-- End #mainContent -->

                <jsp:include page="includes/footer.jsp"/>

            </div>
            <!-- End #content -->
        </div>
        <!-- End #container -->
    </div>
</div>
<!-- End #wrapper -->

<jsp:include page="includes/popups.jsp"/>

</body>
<!-- End #page -->

</html>