import React, { useState, useEffect } from 'react';
import { Modal, Icon } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import ScanModal from './ScanModal'

let scanModal


const ScanBall = () => {
  const closeModal = () => {
    if (scanModal) {
      scanModal.close()
    }
  }

  const showScanModal = () => {
    scanModal = Modal.open({
      key: Modal.key(),
      title: '待检检验任务切换',
      destroyOnClose: true,
      style: {
        width: 800,
      },
      children: <ScanModal modalCallback={closeModal} />,
      okText: '关闭',
      cancelButton: false,
    })
  }

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      let _x = window.innerWidth - e.clientX - 25
      let _y = window.innerHeight - e.clientY - 25
      if (_x < 0) {
        _x = 0
      }
      if (_y < 0) {
        _y = 0
      }
      if (_x > window.innerWidth - 250) {
        _x = window.innerWidth - 250
      }
      if (_y > window.innerHeight - 100) {
        _y = window.innerHeight - 100
      }
      setPosition({
        x: _x,
        y: _y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div>
      <div
        onMouseDown={handleMouseDown}
        onClick={showScanModal}
        style={{
          position: 'fixed',
          right: position.x,
          bottom: position.y,
          width: '50px',
          height: '50px',
          backgroundColor: '#4c7cf5',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon type="crop_free" style={{
          color: '#fff',
          fontSize: '30px',
        }} />
      </div>
    </div>
  );
};

export default formatterCollections({
  code: ['tarzan.qms.inspectionPlatform', 'tarzan.common'],
})(ScanBall);

