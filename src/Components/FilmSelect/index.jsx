import React, { useEffect, useState } from "react";
import useStyle from "./style";
import Button from "@material-ui/core/Button";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Grid } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { LayThongTinPhim } from "../../Container/HomeTemplate/Home/modules/action";

function filterDupliData(arr, comp) {
  const unique = arr
    .map((e) => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e]);

  return unique;
}

function SelectFilm() {
  const classes = useStyle();
  const dispatch = useDispatch();

  const [selectInfo, setSelectInfo] = useState({
    maPhim: "",
    maRap: "",
    ngayXem: "",
    suatChieu: "",
  });

  const [showTime, setShowTime] = useState({
    rapChieu: [],
    ngayChieu: [],
    suatChieu: [],
  });

  const receiveLichChieu = useSelector(
    (state) => state.HomeReducer.lichChieu.lichChieu
  );

  useEffect(() => {
    if (receiveLichChieu) {
      setShowTime({
        ...showTime,
        rapChieu: filterDupliData(receiveLichChieu, "maRap"),
      });
    }
  }, [receiveLichChieu]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectInfo({ ...selectInfo, [name]: value });
  };

  //** setting form control
  const setting = {
    variant: "filled",
    disableunderline: "true",
  };

  // ** RENDER FILM
  const danhSachPhim = useSelector((state) => state.HomeReducer.danhSachPhim);
  const renderPhim = () => {
    let tenPhim = [];
    if (danhSachPhim.length > 0) {
      for (let i = 0; i < 10; i++) {
        tenPhim.push(danhSachPhim[i]);
      }
    }

    return tenPhim.map((item) => {
      return (
        <MenuItem key={uuidv4()} value={item.maPhim}>
          {item.tenPhim}
        </MenuItem>
      );
    });
  };
  //** HANDLE SELECT FILM
  useEffect(() => {
    if (selectInfo.maPhim) {
      dispatch(LayThongTinPhim(selectInfo.maPhim));
      setShowTime({
        rapChieu: [],
        ngayChieu: [],
        suatChieu: [],
      });
      setSelectInfo({
        ...selectInfo,
        maRap: "",
        ngayXem: "",
        suatChieu: "",
      });
    }
  }, [selectInfo.maPhim]);

  // ** RENDER R???P
  const renderRap = () => {
    if (!selectInfo.maPhim) {
      return <MenuItem disabled>Vui l??ng ch???n phim</MenuItem>;
    }
    if (!showTime.rapChieu.length) {
      return <MenuItem disabled>Vui l??ng ch??? trong gi??y l??t</MenuItem>;
    }
    if (showTime.rapChieu) {
      return showTime.rapChieu.map((item) => {
        return (
          <MenuItem key={uuidv4()} value={item.maRap}>
            {item.thongTinRap.tenCumRap}
          </MenuItem>
        );
      });
    }
  };
  // ** HANDLE SELECT R???P
  useEffect(() => {
    setSelectInfo({
      ...selectInfo,
      ngayXem: "",
      suatChieu: "",
    });
  }, [selectInfo.maRap]);

  // ** RENDER NG??Y
  const renderNgay = () => {
    if (!selectInfo.maRap) {
      return <MenuItem disabled>Vui l??ng ch???n phim v?? r???p</MenuItem>;
    }

    return showTime.ngayChieu.map((item) => {
      return (
        <MenuItem key={uuidv4()} value={item}>{`${item.slice(
          8,
          10
        )}-${item.slice(5, 7)}`}</MenuItem>
      );
    });
  };
  // ** HANDLE SELECT NG??Y
  useEffect(() => {
    if (selectInfo.maRap) {
      setShowTime({
        ...showTime,
        ngayChieu: [
          ...new Set(
            receiveLichChieu
              .filter((item) => item.maRap === selectInfo.maRap && item)
              .map((item) => item.ngayChieuGioChieu)
              .map((item) => item.slice(0, 10))
          ),
        ],
      });
    }
  }, [selectInfo.maRap]);

  // ** RENDER SU???T CHI???U
  const renderSuatChieu = () => {
    if (!selectInfo.ngayXem) {
      return <MenuItem disabled>Vui l??ng ch???n phim, r???p, ng??y xem</MenuItem>;
    }
    return showTime.suatChieu.map((item) => {
      return (
        <MenuItem
          key={uuidv4()}
          value={item.maLichChieu}
        >{`${item.ngayChieuGioChieu.slice(11, 16)}`}</MenuItem>
      );
    });
  };

  // ** HANDLE SELECT SU???T CHI???U
  useEffect(() => {
    if (selectInfo.ngayXem) {
      setShowTime({
        ...showTime,
        suatChieu: receiveLichChieu.filter((item) =>
          item.ngayChieuGioChieu.includes(selectInfo.ngayXem)
        ),
      });
    }
  }, [selectInfo.ngayXem]);

  return (
    <div className={classes.borderPosition}>
      <Grid
        className={`container flexHorizon ${classes.selectFilmBorder}`}
        container
        spacing={2}
      >
        {/* // ** select m?? phim */}
        <Grid className={`${classes.filmSelect}`} item xs={4}>
          <FormControl className={classes.formControl} {...setting} fullWidth>
            <InputLabel id="filmSelect">Phim</InputLabel>
            <Select
              className={classes.root}
              labelId="filmSelect"
              id="filmSelect"
              value={selectInfo.maPhim}
              name="maPhim"
              label="Vui l??ng ch???n phim"
              onChange={handleChange}
            >
              {renderPhim()}
            </Select>
          </FormControl>
        </Grid>
        {/* // ** select r???p */}
        <Grid className={`${classes.cinemaSelect}`} item xs={2}>
          <FormControl className={classes.formControl} {...setting} fullWidth>
            <InputLabel id="cinemaSelect">R???p</InputLabel>
            <Select
              className={classes.root}
              labelId="cinemaSelect"
              id="cinemaSelect"
              value={selectInfo.maRap}
              name="maRap"
              label="Vui l??ng ch???n r???p"
              onChange={handleChange}
            >
              {renderRap()}
            </Select>
          </FormControl>
        </Grid>
        {/* // ** select ng??y */}
        <Grid className={`${classes.daySelect}`} item xs={2}>
          <FormControl className={classes.formControl} {...setting} fullWidth>
            <InputLabel id="daySelect">Ng??y xem</InputLabel>
            <Select
              className={classes.root}
              labelId="daySelect"
              id="daySelect"
              value={selectInfo.ngayXem}
              name="ngayXem"
              label="Vui l??ng ch???n ng??y xem"
              onChange={handleChange}
            >
              {renderNgay()}
            </Select>
          </FormControl>
        </Grid>
        {/* // ** select gi??? */}
        <Grid className={`${classes.timeSelect}`} item xs={2}>
          <FormControl className={classes.formControl} {...setting} fullWidth>
            <InputLabel id="filmSelect">Su???t chi???u</InputLabel>
            <Select
              className={classes.root}
              labelId="filmSelect"
              id="filmSelect"
              value={selectInfo.suatChieu}
              name="suatChieu"
              label="Vui l??ng ch???n phim"
              onChange={handleChange}
            >
              {renderSuatChieu()}
            </Select>
          </FormControl>
        </Grid>
        {/* // ** submit */}
        <Grid className={`${classes.submit}`} item xs={2}>
          <Button className={classes.submitButton} fullWidth>
            Mua v?? ngay
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default SelectFilm;
