/* ============================================================
   SeatBook - 静态原型交互脚本
   仅用于原型演示，不接真实后端
   ============================================================ */

// 体验账号切换
document.addEventListener('DOMContentLoaded', function () {
  const userSwitches = document.querySelectorAll('.user-switch select');
  userSwitches.forEach(function (sel) {
    sel.addEventListener('change', function () {
      const name = this.options[this.selectedIndex].text;
      const display = document.getElementById('current-user');
      if (display) {
        display.textContent = name;
      }
      // 模拟切换提示
      const toastEl = document.getElementById('switch-toast');
      if (toastEl) {
        toastEl.querySelector('.toast-body').textContent = '已切换至：' + name;
        const toast = new bootstrap.Toast(toastEl, { delay: 1500 });
        toast.show();
      }
    });
  });

  // 取消预约确认弹窗
  const cancelBtns = document.querySelectorAll('.btn-cancel-reservation');
  cancelBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const seatNum = this.getAttribute('data-seat') || '该座位';
      const modalBody = document.getElementById('cancel-modal-body');
      if (modalBody) {
        modalBody.textContent = '确定要取消 ' + seatNum + ' 的预约吗？取消后座位将释放给其他同学。';
      }
      const modal = new bootstrap.Modal(document.getElementById('cancelConfirmModal'));
      modal.show();
    });
  });

  // 确认取消后模拟刷新
  const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
  if (confirmCancelBtn) {
    confirmCancelBtn.addEventListener('click', function () {
      const modal = bootstrap.Modal.getInstance(document.getElementById('cancelConfirmModal'));
      if (modal) modal.hide();
      // 模拟状态变更：找到最近的记录卡片，变更其状态
      const card = document.querySelector('.reservation-card .status-badge-booked');
      if (card) {
        card.className = 'status-badge status-badge-cancelled';
        card.innerHTML = '<span class="dot"></span> 已取消';
        const cancelBtn = card.closest('.reservation-card')?.querySelector('.btn-cancel-reservation');
        if (cancelBtn) cancelBtn.remove();
      }
      // 显示成功提示
      const alertBox = document.getElementById('cancel-success-alert');
      if (alertBox) {
        alertBox.classList.remove('d-none');
        setTimeout(function () { alertBox.classList.add('d-none'); }, 3000);
      }
    });
  }

  // 预约提交模拟
  const submitReservationBtn = document.getElementById('submit-reservation');
  if (submitReservationBtn) {
    submitReservationBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const errBox = document.getElementById('reservation-error');
      const successBox = document.getElementById('reservation-success');
      const dateVal = document.getElementById('res-date')?.value;
      const timeVal = document.getElementById('res-time')?.value;
      if (!dateVal || !timeVal) {
        if (errBox) {
          errBox.classList.remove('d-none');
          errBox.textContent = '请选择日期和时段';
        }
        return;
      }
      if (errBox) errBox.classList.add('d-none');
      // 模拟冲突检测：特定时段触发冲突
      if (timeVal === '08:00-12:00' && dateVal === '2026-07-07') {
        if (errBox) {
          errBox.classList.remove('d-none');
          errBox.textContent = '该时段已被预约，请选择其他时段';
        }
        return;
      }
      // 成功
      if (successBox) successBox.classList.remove('d-none');
      submitReservationBtn.disabled = true;
      submitReservationBtn.textContent = '预约成功 ✓';
      setTimeout(function () {
        window.location.href = 'my-reservations.html?success=1';
      }, 1200);
    });
  }

  // 我的预约页：url 参数检测成功提示
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === '1') {
    const alertBox = document.getElementById('book-success-alert');
    if (alertBox) {
      alertBox.classList.remove('d-none');
      setTimeout(function () { alertBox.classList.add('d-none'); }, 3000);
    }
  }

  // 管理端标记完成
  const completeBtns = document.querySelectorAll('.btn-complete');
  completeBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const row = this.closest('tr');
      if (row) {
        const statusCell = row.querySelector('.status-badge');
        if (statusCell) {
          statusCell.className = 'status-badge status-badge-completed';
          statusCell.innerHTML = '<span class="dot"></span> 已完成';
        }
        this.remove();
      }
    });
  });

  // 座位管理状态切换
  const toggleStatusBtns = document.querySelectorAll('.btn-toggle-status');
  toggleStatusBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const row = this.closest('tr');
      if (!row) return;
      const statusCell = row.querySelector('.status-badge');
      if (!statusCell) return;
      const isAvailable = statusCell.classList.contains('status-badge-available');
      if (isAvailable) {
        statusCell.className = 'status-badge status-badge-maintenance';
        statusCell.innerHTML = '<span class="dot"></span> 维护中';
        this.textContent = '设为空闲';
        this.className = 'btn btn-seatbook-success btn-seatbook-sm btn-toggle-status';
      } else {
        statusCell.className = 'status-badge status-badge-available';
        statusCell.innerHTML = '<span class="dot"></span> 空闲';
        this.textContent = '设为维护';
        this.className = 'btn btn-seatbook-outline btn-seatbook-sm btn-toggle-status';
      }
    });
  });

  // 管理员登录模拟
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const errBox = document.getElementById('login-error');
      if (username === 'admin' && password === 'admin123') {
        window.location.href = 'admin-reservations.html';
      } else {
        if (errBox) {
          errBox.classList.remove('d-none');
        }
      }
    });
  }

  // 管理端退出登录
  const logoutBtns = document.querySelectorAll('.logout-btn');
  logoutBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'admin-login.html';
    });
  });
});
