// [MEMO] 근무 보고서 인쇄
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import styled from 'styled-components';
import axios from 'axios';
import ReactToPrint from 'react-to-print'; // 프린트, 🚨 임시 주석(모듈 오류)

interface WorkRecordReportPrintingProps {
  apartmentName: string;
  calStartYear: string;
  calStartMonth: string;
  calStartDate: string;
  calEndYear: string;
  calEndMonth: string;
  calEndDate: string;
}

const WorkRecordReportPrinting = ({
  apartmentName,
  calStartYear,
  calStartMonth,
  calStartDate,
  calEndYear,
  calEndMonth,
  calEndDate,
}: WorkRecordReportPrintingProps) => {
  useEffect(() => {
    onLoadBtn({
      // recordListData,
      setRecordListData,
    });
  }, []);

  c;
  const [recordListData, setRecordListData] = useState([]);

  const apartmentNameAtSessionStorage = sessionStorage.getItem('apartmentName');

  const startDate = `${calStartYear}-${calStartMonth}-${calStartDate}`;
  const endDate = `${calEndYear}-${calEndMonth}-${calEndDate}`;

  const dataArray = [];

  function loadRecordListData() {
    recordListData &&
      recordListData.forEach((data) => {
        let trackingGroupName = ''; // 분류
        let trackingTypeName = ''; // 기기
        let actionName = ''; // 행동
        let checkAttachedReport = false; // 보고서
        let checkAttachedFile = false; // 첨부파일

        if (data.TrackingGroup === 'W') {
          trackingGroupName = '근무';
        } else if (data.TrackingGroup === 'A') {
          // 근태 = 출퇴근
          trackingGroupName = '근태';
        }

        if (data.TrackingType === 'N') {
          trackingTypeName = 'NFC';
        } else if (data.TrackingType === 'B') {
          trackingTypeName = 'Beacon';
        } else if (data.TrackingType === 'G') {
          trackingTypeName = 'GPS';
        } else if (data.TrackingType === 'W') {
          trackingTypeName = 'WIFI';
        }

        if (data.Action === 'I') {
          actionName = 'IN';
        } else if (data.Action === 'L') {
          actionName = 'LEAVE';
        } else if (data.Action === 'O') {
          actionName = 'OUT';
        } else if (data.Action === 'A') {
          actionName = '태그';
        }

        if (data.AttacheFile.length > 0) {
          checkAttachedReport = true;
        } else checkAttachedReport = false;

        if (data.AttacheReport > 0) {
          checkAttachedFile = true;
        } else checkAttachedFile = false;

        const resultData = {
          apartmentName: apartmentName, // 단지명
          trackingLocation: data.TrackingLocation, // 순찰구역
          categoryName: data.CategoryName, // 소속
          employeeName: data.EmployeeName, // 근무자
          employeeNum: data.EmployeeNo, // 사번
          date: data.TrigerTime.slice(0, 10), // 날짜
          time: data.TrigerTime.slice(11, 19), // 시간
          action: actionName,
          trackingGroup: trackingGroupName,
          trackingType: trackingTypeName,
          checkAttachedReport: checkAttachedReport,
          checkAttachedFile: checkAttachedFile,
          attachedFileName: data.AttacheFile,
          recordIdx: data.idx,
        };

        dataArray.push(resultData);
      });
  }
  loadRecordListData();

  // 👇 오늘 날짜
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  const onLoadBtn = async () => {
    await axios
      .get(
        `/data/test-1.json` // 목데이터
      )
      .then((res) => {
        try {
          if (res.data.ErrorCode === 0) {
            setRecordListData(res.data.Data);
          }
        } catch (e) {
          console.error(e);
          console.log(
            `ErrorCode: ${res.data.ErrorCode}, ErrorMsg: ${res.data.ErrorMsg}`
          );
        }
      });
  };

  const itemsPerPage = 10; // 한 페이지에 출력할 항목 수

  // 데이터를 페이지당 항목 수로 분할
  const pages = [];
  let pageIndex = 0;

  for (let i = 0; i < dataArray.length; i++) {
    if (!pages[pageIndex]) {
      pages[pageIndex] = [];
    }

    pages[pageIndex].push(dataArray[i]);

    if (pages[pageIndex].length === itemsPerPage) {
      pageIndex++;
    }
  }

  return (
    <>
      <div style={{ position: 'fixed', top: 0 }}>
        {/* <ReactToPrint
          trigger={() => (
            <button
              style={{
                padding: '5px',
                borderRadius: '0.5em',
                backgroundColor: 'black',
                color: 'white',
                fontSize: '20px',
              }}
            >
              인쇄하기
            </button>
          )}
          content={() => ref.current}
        /> */}
        <button onClick={() => window.print()}>인쇄하기</button>
      </div>

      <TitleSection>
        <TitleBox>근무 보고서</TitleBox>

        <InfoBox>
          <div>
            단지명:
            {apartmentNameAtSessionStorage
              ? apartmentNameAtSessionStorage
              : apartmentName}
          </div>
          <div>주식회사 앰앰아이</div>
        </InfoBox>
      </TitleSection>

      <EmployeeInfoCategory>
        <EmployeeInfoBox>
          <EmployeeInfoTitle>기간</EmployeeInfoTitle>
          <EmployeeInfoContents>
            {startDate} ~ {endDate}
          </EmployeeInfoContents>
        </EmployeeInfoBox>

        <EmployeeInfoBox>
          <EmployeeInfoTitle>작성일</EmployeeInfoTitle>
          <EmployeeInfoContents className='right-section'>
            {today}
          </EmployeeInfoContents>
        </EmployeeInfoBox>
      </EmployeeInfoCategory>

      <EmployeeInfoCategory>
        <EmployeeInfoBox>
          <EmployeeInfoTitle>소속</EmployeeInfoTitle>
          <EmployeeInfoContents>전체</EmployeeInfoContents>
        </EmployeeInfoBox>

        <EmployeeInfoBox>
          <EmployeeInfoTitle>근무자</EmployeeInfoTitle>
          <EmployeeInfoContents className='right-section'>
            전체
          </EmployeeInfoContents>
        </EmployeeInfoBox>
      </EmployeeInfoCategory>

      <EmployeeInfoCategory>
        <EmployeeInfoBox className='bottom'>
          <EmployeeInfoTitle>행동</EmployeeInfoTitle>
          <EmployeeInfoContents>순찰</EmployeeInfoContents>
        </EmployeeInfoBox>

        <EmployeeInfoBox className='bottom'>
          <EmployeeInfoTitle>건수</EmployeeInfoTitle>
          <EmployeeInfoContents className='right-section'>
            {dataArray.length}
          </EmployeeInfoContents>
        </EmployeeInfoBox>
      </EmployeeInfoCategory>

      <WorkRecordListTitle>근무기록표</WorkRecordListTitle>

      <RecordListCategory>
        <RecordListCategoryWrap className='report-idx'>
          <RecordListCategoryTitle>날짜</RecordListCategoryTitle>
        </RecordListCategoryWrap>

        <RecordListCategoryWrap className='job-group'>
          <RecordListCategoryTitle>소속</RecordListCategoryTitle>
        </RecordListCategoryWrap>

        <RecordListCategoryWrap className='employee-name'>
          <RecordListCategoryTitle>근무자</RecordListCategoryTitle>
        </RecordListCategoryWrap>

        <RecordListCategoryWrap className='time'>
          <RecordListCategoryTitle>시간</RecordListCategoryTitle>
        </RecordListCategoryWrap>

        <RecordListCategoryWrap className='location'>
          <RecordListCategoryTitle>순찰구역</RecordListCategoryTitle>
        </RecordListCategoryWrap>

        <RecordListCategoryWrap className='action'>
          <RecordListCategoryTitle>기기유형</RecordListCategoryTitle>
        </RecordListCategoryWrap>
      </RecordListCategory>

      {/* <Wrap
        ref={ref}
        onClick={e => {
          e.stopPropagation();
        }}
      > */}

      {pages.map((page, pageIndex) => (
        <>
          <Tables
          // style={{pageBreakBefore: 'always'}}
          >
            <tbody>
              <tr
                key={pageIndex}
                style={
                  {
                    // display: 'flex',
                    // flexDirection: 'column',
                    // height: '297mm',
                  }
                }
              >
                {page.map((row, index) => (
                  <div key={index}>
                    {/* 각 항목의 내용을 여기에 표시 */}
                    <RecordListResult>
                      <RecordListDatesSection className='report-idx '>
                        <RecordListDates>{row.date}</RecordListDates>
                      </RecordListDatesSection>
                      <RecordListDatesSection className='job-group'>
                        <RecordListDates>{row.categoryName}</RecordListDates>
                      </RecordListDatesSection>
                      <RecordListDatesSection className='employee-name'>
                        <RecordListDates>{row.employeeName}</RecordListDates>
                      </RecordListDatesSection>
                      <RecordListDatesSection className='time'>
                        <RecordListDates>{row.time}</RecordListDates>
                      </RecordListDatesSection>
                      <RecordListDatesSection className='location'>
                        <RecordListDates>
                          {row.trackingLocation}
                        </RecordListDates>
                      </RecordListDatesSection>
                      <RecordListDatesSection className='action'>
                        <RecordListDates>{row.trackingType}</RecordListDates>
                      </RecordListDatesSection>
                    </RecordListResult>
                  </div>
                ))}
              </tr>
            </tbody>
          </Tables>
          <p style={{ pageBreakBefore: 'always' }} />
        </>
      ))}
    </>
  );
};

export default WorkRecordReportPrinting;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 210mm;
  height: 297mm;
  background-color: white;
  /* page-break-after: always; */ /* 페이지 브레이크 설정 */
  break-after: always; /* 페이지 브레이크 설정 */
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  margin-top: 5mm;
  /* margin-bottom: 7mm; */ /* 🚨🚨🚨🚨🚨 결재 박스 관련(기존) */
  /* margin-bottom: 10px; */ /* 🚨🚨🚨🚨🚨 결재 박스 관련(수정 후)1 */
  margin-bottom: 5.8mm; /* 🚨🚨🚨🚨🚨 결재 박스 관련(수정 후)2 */
`;

const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

const Tables = styled.table`
  width: 100%;
`;

export const ThEmployeeNameHeader = styled.th`
  display: table-cell; /* 테이블 셀 중앙정렬 */
  vertical-align: middle; /* 테이블 셀 중앙정렬 */
  text-align: center; /* 테이블 셀 중앙정렬 */
  width: 25px; /* [MEMO] 이름 너비 */
  border-bottom: solid 1px ${({ theme }) => theme.fontColor.black};
  border-right: solid 1px ${({ theme }) => theme.fontColor.black};
  height: 24px; /* ✅ 구분 높이 */
`;

export const ThTotalWorkingTimeHeader = styled.th`
  display: table-cell; /* 테이블 셀 중앙정렬 */
  vertical-align: middle; /* 테이블 셀 중앙정렬 */
  text-align: center; /* 테이블 셀 중앙정렬 */
  width: 15px; /* [MEMO] 총 근무시간 너비 */
  border-bottom: solid 1px ${({ theme }) => theme.fontColor.black};
  border-right: solid 1px ${({ theme }) => theme.fontColor.black};
  height: 24px; /* ✅ 구분 높이 */
`;

export const EmployeeInfoCategory = styled.div`
  display: flex;
  /* height: 2.5%; */
  font-size: 14px;
`;

export const EmployeeInfoBox = styled.div`
  display: flex;
  width: 50%;
  border-top: solid 1px black;

  &.bottom {
    /* border-bottom: solid 1px black; */
  }
`;

export const EmployeeInfoTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  border-right: solid 1px black;
  border-left: solid 1px black;
  font-weight: 600;

  padding: 5px 0;
  /* border: solid 1px red; */
`;

export const EmployeeInfoContents = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;
  width: 70%;

  padding: 5px 0;

  &.right-section {
    border-right: solid 1px black;
  }
`;

export const WorkRecordListTitle = styled.td`
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 2.5%; */
  border: solid 1px black;
  background-color: lightGray;
  font-size: 15px;
  font-weight: 600;

  padding: 5px 0;
`;

export const RecordListCategory = styled.div`
  display: flex;
  /* height: 2.5%; */
  font-size: 12px;
  font-weight: 600;
`;

export const RecordListCategoryWrap = styled.div`
  /* width: 30%; */
  border-bottom: solid 1px black;
  border-right: solid 1px black;

  padding: 5px 0;

  &.report-idx {
    width: 10%;
    border-left: solid 1px black;
  }

  &.job-group {
    width: 20%;
  }

  &.employee-name {
    width: 20%;
  }

  &.time {
    width: 20%;
  }

  &.location {
    width: 20%;
  }

  &.action {
    width: 10%;
  }
`;

export const RecordListCategoryTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const TdRecordList = styled.td`
  display: flex;
`;

export const RecordListResultSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 10px;
`;

export const RecordListResult = styled.div`
  display: flex;
  /* height: 25px; */ /* 🚨🚨🚨🚨🚨 결재 박스 관련(기존) */
  height: 23px; /* 🚨🚨🚨🚨🚨 결재 박스 관련(수정 후) */
`;

export const RecordListDatesSection = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 10%; */

  &.report-idx {
    width: 10%;
    border-left: solid 1px black;
  }

  &.job-group {
    width: 20%;
  }

  &.employee-name {
    width: 20%;
  }

  &.time {
    width: 20%;
  }

  &.location {
    width: 20%;
  }

  &.action {
    width: 10%;
  }
`;

export const RecordListDates = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 25px;
  border-bottom: solid 1px black;
  border-right: solid 1px black;
  font-size: 10px;
  font-weight: 600;

  p {
    margin-right: 5px;
  }
`;

const ThDateHeader = styled.th`
  display: table-cell; /* 테이블 셀 중앙정렬 */
  vertical-align: middle; /* 테이블 셀 중앙정렬 */
  text-align: center; /* 테이블 셀 중앙정렬 */
  width: 5px; /* [MEMO] 날짜 너비 */
  height: 24px; /* ✅ 구분 높이 */

  border-bottom: solid 1px ${({ theme }) => theme.fontColor.black};
  border-left: solid 1px ${({ theme }) => theme.fontColor.black};

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    // margin-bottom: 5px;
    width: 5px; /* [MEMO] 날짜 너비 */
  }
`;

export const TdTimeInfo = styled.td`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  border-bottom: solid 1px ${({ theme }) => theme.fontColor.black};
  border-left: solid 1px ${({ theme }) => theme.fontColor.black};
  width: 20px;
`;

export const StatusResultBox = styled.div`
  div {
    font-size: 10px;
    font-weight: 600;

    &.nothing {
      /* [MEMO] 출근 태그 */
      display: flex;
      justify-content: center;

      border-bottom: solid 1px ${({ theme }) => theme.fontColor.black};
      height: 8mm; /* 📌 날짜 높이 */
      width: 100%;
    }

    &.time-to-work {
      /* [MEMO] 출근 태그 */
      display: flex;
      justify-content: center;
      align-items: center;

      border-bottom: solid 1px ${({ theme }) => theme.fontColor.black};
      height: 8mm; /* 📌 날짜 높이 */
      width: 100%;
    }

    &.time-to-home {
      /* [MEMO] 퇴근 태그 */
      display: flex;
      justify-content: center;
      align-items: center;

      border-bottom: solid 1px ${({ theme }) => theme.fontColor.black};
      height: 8mm; //* 📌 날짜 높이 */
      width: 100%;
    }

    /* working */
    &.time-to-break {
      /* [MEMO] 연차 태그 */
      display: flex;
      justify-content: center;
      align-items: center;

      height: 8mm; /* 📌 높이 */
      width: 100%;
    }
  }
`;
