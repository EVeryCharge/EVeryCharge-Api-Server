import React from 'react';
import { Typography, Link, Box, Card, CardContent, Grid } from '@material-ui/core';
import QRCode from 'qrcode.react'; // QRCode import
const ChargingServiceInfo = () => {
  return (
    <Box mt={4} mb={4}>
      <Typography variant="h5" gutterBottom>서비스 안내</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>고객 서비스 (PC)</Typography>
              <Typography variant="subtitle1" gutterBottom>특징</Typography>
              <ul>
                <li>GIS 기반 충전소 위치 및 충전기 상태 정보 제공 (한전 및 전체 충전서비스사업자)</li>
                <li>한전 회원 충전내역 등 충전정보 확인 가능</li>
                <li>충전기 통계, 충전기 정보 등 고객지원 서비스 제공</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>고객 서비스 (모바일)</Typography>
              <Typography variant="subtitle1" gutterBottom>특징</Typography>
              <ul>
                <li>GIS 기반 충전소 위치 및 충전기 상태 정보 제공 (한전 및 전체 충전서비스사업자)</li>
                <li>T-map 연동으로 실시간 충전소 길찾기 기능 지원</li>
                <li>충전기 통계, 간편결제 등록 등 고객지원 서비스 제공</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>어플리케이션 다운로드</Typography>
        <Typography variant="subtitle1" gutterBottom>안드로이드</Typography>
        <Link href="https://play.google.com/store" target="_blank" rel="noopener">구글플레이스토어 접속 후 한전충전서비스 어플리케이션 다운로드</Link>
        <QRCode value="example" size={64} style={{ marginLeft: '50px' }} />

        
        <Typography variant="subtitle1" gutterBottom>아이폰</Typography>
        <Link href="https://www.apple.com/app-store/" target="_blank" rel="noopener">앱스토어 접속 후 한전충전서비스 어플리케이션 다운로드</Link>
        <QRCode value="example" size={64} style={{ marginLeft: '50px' }} />

      </Box>
    </Box>
  );
};

export default ChargingServiceInfo;
