import './App.css';
import styled from 'styled-components';
import axios from 'axios';
// import ReactToPrint from 'react-to-print'; // 프린트, 🚨 임시 주석(모듈 오류)

const WorkRecordReportPrinting = () => {
  document.addEventListener("DOMContentLoaded", function() {
    // 최초 렌더링 시 실행할 함수
    // 이 곳에 원하는 작업을 추가합니다.
    onLoadBtn()
    console.log("최초 렌더링 시 실행될 함수");
  });

  document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      // 최초 렌더링 시 실행할 비동기 함수
      // 이 곳에 원하는 작업을 추가합니다.
      onLoadBtn()
      console.log("최초 렌더링 시 실행될 함수 (비동기)");
    }, 0);
  });

  // useEffect(() => {
  //     onLoadBtn({
  //       // recordListData,
  //       setRecordListData,
  //     });
  // }, []);

  const recordListData=[];
  const dataArray = [];

  function loadRecordListData() {
    recordListData &&
      recordListData.forEach(data => {
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
          apartmentName: '00단지', // 단지명
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
        `/data/test-1.json`, // 목데이터
      )
      .then(res => {
        try {
          if (res.data.ErrorCode === 0) {
            // setRecordListData(res.data.Data);
            recordListData = res.data.Data;
          }

        } catch (e) {
          console.error(e);
          console.log(
            `ErrorCode: ${res.data.ErrorCode}, ErrorMsg: ${res.data.ErrorMsg}`
          );
        }
      });
  };


  return (
    <>
      {/* <div style={{ position: 'fixed', top: 0 }}>
        <ReactToPrint
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
        />
      </div> */}

      <div className='Wrap'
        // ref={ref}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Tables>
          <tbody>
            <tr
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '297mm',
              }}
            >
              <td>
                <div className='TitleSection'>
                  <div className='TitleBox'>근무 보고서</div>

                  <div className='InfoBox'>
                    <div>
                      단지명: 땡땡 단지
                    </div>
                    <div>주식회사 앰앰아이</div>
                  </div>
                </div>
              </td>

              <td className='TdEmployeeInfoCategory'>
                <div className='EmployeeInfoBox'>
                  <div className='EmployeeInfoTitle'>기간</div>
                  <div className='EmployeeInfoContents'>
                    0000-00-00 ~ 0000-00-00
                  </div>
                </div>

                <div className='EmployeeInfoBox'>
                  <div className='EmployeeInfoTitle'>작성일</div>
                  <div className='EmployeeInfoContents' className="right-section">
                    {today}
                  </div>
                </div>
              </td>

              <td className='TdEmployeeInfoCategory'>
                <div className='EmployeeInfoBox'>
                  <div className='EmployeeInfoTitle'>소속</div>
                  <div className='EmployeeInfoContents'>전체</div>
                </div>

                <div className='EmployeeInfoBox'>
                  <div className='EmployeeInfoTitle'>근무자</div>
                  <div className='EmployeeInfoContents' className="right-section">
                    전체
                  </div>
                </div>
              </td>

              <td className='TdEmployeeInfoCategory'>
                <div className='EmployeeInfoBox' className="bottom">
                  <div className='EmployeeInfoTitle'>행동</div>
                  <div className='EmployeeInfoContents'>순찰</div>
                </div>

                <div className='EmployeeInfoBox' className="bottom">
                  <div className='EmployeeInfoTitle'>건수</div>
                  <div className='EmployeeInfoContents' className="right-section">
                    {dataArray.length}
                  </div>
                </div>
              </td>

              <td className='WorkRecordListTitle'>근무기록표</td>

              <td className='TdRecordListCategory'>
                <div className="RecordListCategoryWrap report-idx">
                  <RecordListCategoryTitle>날짜</RecordListCategoryTitle>
                </div>

                <div className="RecordListCategoryWrap job-group">
                  <RecordListCategoryTitle>소속</RecordListCategoryTitle>
                </div>

                <div className="RecordListCategoryWrap employee-name">
                  <RecordListCategoryTitle>근무자</RecordListCategoryTitle>
                </div>

                <div className="RecordListCategoryWrap time">
                  <RecordListCategoryTitle>시간</RecordListCategoryTitle>
                </div>

                <div className="RecordListCategoryWrap location">
                  <RecordListCategoryTitle>순찰구역</RecordListCategoryTitle>
                </div>

                <div className="RecordListCategoryWrap action">
                  <RecordListCategoryTitle>기기유형</RecordListCategoryTitle>
                </div>
              </td>

              <td className='TdRecordList'>
                <div className='RecordListResultSection'>
                  {dataArray.map((row, idx) => (
                    <div className='RecordListResult' key={idx}>
                      <div className="RecordListDatesSection report-idx ">
                        <RecordListDates>{row.date}</RecordListDates>
                      </div>
                      <div className="RecordListDatesSection job-group">
                        <RecordListDates>{row.categoryName}</RecordListDates>
                      </div>
                      <div className="RecordListDatesSection employee-name">
                        <RecordListDates>{row.employeeName}</RecordListDates>
                      </div>
                      <div className="RecordListDatesSection time">
                        <RecordListDates>{row.time}</RecordListDates>
                      </div>
                      <div className="RecordListDatesSection location">
                        <RecordListDates>
                          {row.trackingLocation}
                        </RecordListDates>
                      </div>
                      <div className="RecordListDatesSection action">
                        <RecordListDates>{row.trackingType}</RecordListDates>
                      </div>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          </tbody>
        </Tables>
      </div>
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


const TdEmployeeInfoCategory = styled.td`
  display: flex;
  /* height: 2.5%; */
  font-size: 14px;
`;

const EmployeeInfoBox = styled.div`
  display: flex;
  width: 50%;
  border-top: solid 1px black;

  &.bottom {
    /* border-bottom: solid 1px black; */
  }
`;

const EmployeeInfoTitle = styled.div`
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

const EmployeeInfoContents = styled.div`
  display: flex;
  align-items: center;
  margin-left: 5px;
  width: 70%;

  padding: 5px 0;

  &.right-section {
    border-right: solid 1px black;
  }
`;

const WorkRecordListTitle = styled.td`
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

const TdRecordListCategory = styled.td`
  display: flex;
  /* height: 2.5%; */
  font-size: 12px;
  font-weight: 600;
`;

const RecordListCategoryWrap = styled.div`
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

const RecordListCategoryTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const TdRecordList = styled.td`
  display: flex;
`;

const RecordListResultSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 10px;
`;

const RecordListResult = styled.div`
  display: flex;
  /* height: 25px; */ /* 🚨🚨🚨🚨🚨 결재 박스 관련(기존) */
  height: 23px; /* 🚨🚨🚨🚨🚨 결재 박스 관련(수정 후) */
`;

const RecordListDatesSection = styled.div`
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

const RecordListDates = styled.div`
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


